// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentPayVault
 * @author AgentPay Team
 * @notice Secure vault for autonomous agent payments using MNEE stablecoin
 * @dev This contract implements a multi-agent payment system with daily spending limits,
 *      recipient whitelisting, and secure MNEE token management. Each agent operates
 *      independently with their own balance and policy configuration.
 * 
 * Key Features:
 * - Individual agent vaults with isolated balances
 * - Daily spending limits with automatic UTC-based resets
 * - Recipient whitelisting for payment authorization
 * - Comprehensive event logging for audit trails
 * - Reentrancy protection and safe token transfers
 * 
 * Security Considerations:
 * - Uses OpenZeppelin's ReentrancyGuard for reentrancy protection
 * - SafeERC20 for secure token transfers with proper error handling
 * - Ownable pattern for administrative functions
 * - Input validation on all external functions
 * 
 * @custom:security-contact security@agentpay.io
 */
contract AgentPayVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/
    
    /// @dev Seconds in a day for daily limit calculations
    uint256 private constant SECONDS_PER_DAY = 86400;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The MNEE token contract used for all payments
    /// @dev Immutable to prevent token address changes after deployment
    IERC20 public immutable MNEE_TOKEN;

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Agent vault data structure containing balance and policy information
     * @dev Each agent has an independent vault with isolated state
     * @param balance Current MNEE token balance in the vault
     * @param dailyLimit Maximum MNEE tokens that can be spent per day
     * @param dailySpent Amount of MNEE tokens spent in the current day
     * @param lastResetDay Day counter for the last daily limit reset (block.timestamp / 1 days)
     * @param whitelist Mapping of recipient addresses authorized to receive payments
     */
    struct AgentVault {
        uint256 balance;
        uint256 dailyLimit;
        uint256 dailySpent;
        uint256 lastResetDay;
        mapping(address => bool) whitelist;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice Mapping from agent address to their vault configuration
    /// @dev Each agent address maps to exactly one AgentVault struct
    mapping(address => AgentVault) public agentVaults;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Emitted when an agent deposits MNEE tokens into their vault
     * @param agent The address of the agent making the deposit
     * @param amount The amount of MNEE tokens deposited (in wei)
     */
    event Deposited(address indexed agent, uint256 amount);

    /**
     * @notice Emitted when an agent updates their daily spending limit
     * @param agent The address of the agent updating the limit
     * @param newLimit The new daily spending limit in MNEE tokens (in wei)
     */
    event DailyLimitSet(address indexed agent, uint256 newLimit);

    /**
     * @notice Emitted when an agent adds a recipient to their whitelist
     * @param agent The address of the agent updating the whitelist
     * @param recipient The address being added to the whitelist
     */
    event RecipientWhitelisted(address indexed agent, address indexed recipient);

    /**
     * @notice Emitted when an agent removes a recipient from their whitelist
     * @param agent The address of the agent updating the whitelist
     * @param recipient The address being removed from the whitelist
     */
    event RecipientRemoved(address indexed agent, address indexed recipient);

    /**
     * @notice Emitted when an agent executes a payment to a whitelisted recipient
     * @param agent The address of the agent executing the payment
     * @param recipient The address receiving the payment
     * @param amount The amount of MNEE tokens transferred (in wei)
     * @param purpose Human-readable description of the payment purpose
     */
    event PaymentExecuted(
        address indexed agent,
        address indexed recipient,
        uint256 amount,
        string purpose
    );

    /**
     * @notice Emitted when an agent withdraws MNEE tokens from their vault
     * @param agent The address of the agent making the withdrawal
     * @param amount The amount of MNEE tokens withdrawn (in wei)
     */
    event Withdrawn(address indexed agent, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when a zero address is provided where a valid address is required
    error InvalidAddress();

    /// @notice Thrown when a zero amount is provided where a positive amount is required
    error InvalidAmount();

    /// @notice Thrown when an agent has insufficient balance for the requested operation
    error InsufficientBalance();

    /// @notice Thrown when a payment would exceed the agent's daily spending limit
    error DailyLimitExceeded();

    /// @notice Thrown when attempting to pay a recipient not on the agent's whitelist
    error RecipientNotWhitelisted();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initializes the AgentPayVault with the MNEE token contract
     * @dev Sets the deployer as the initial owner and stores the MNEE token reference
     * @param _mneeToken The address of the MNEE ERC-20 token contract
     * @custom:throws InvalidAddress if _mneeToken is the zero address
     */
    constructor(address _mneeToken) Ownable(msg.sender) {
        if (_mneeToken == address(0)) {
            revert InvalidAddress();
        }
        MNEE_TOKEN = IERC20(_mneeToken);
    }

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Deposits MNEE tokens into the caller's agent vault
     * @dev Requires prior approval of MNEE tokens to this contract
     * @param amount The amount of MNEE tokens to deposit (must be > 0)
     * @custom:throws InvalidAmount if amount is zero
     * @custom:emits Deposited
     */
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert InvalidAmount();
        }

        // Transfer MNEE tokens from agent to vault
        MNEE_TOKEN.safeTransferFrom(msg.sender, address(this), amount);

        // Update agent balance
        agentVaults[msg.sender].balance += amount;

        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Sets the daily spending limit for the caller's agent vault
     * @dev The limit applies to the total amount that can be spent per UTC day
     * @param limit The new daily spending limit in MNEE tokens (can be 0 to disable spending)
     * @custom:emits DailyLimitSet
     */
    function setDailyLimit(uint256 limit) external {
        agentVaults[msg.sender].dailyLimit = limit;
        emit DailyLimitSet(msg.sender, limit);
    }

    /**
     * @notice Adds a recipient address to the caller's payment whitelist
     * @dev Only whitelisted recipients can receive payments from an agent
     * @param recipient The address to add to the whitelist (must not be zero address)
     * @custom:throws InvalidAddress if recipient is the zero address
     * @custom:emits RecipientWhitelisted
     */
    function addRecipient(address recipient) external {
        if (recipient == address(0)) {
            revert InvalidAddress();
        }
        agentVaults[msg.sender].whitelist[recipient] = true;
        emit RecipientWhitelisted(msg.sender, recipient);
    }

    /**
     * @notice Removes a recipient address from the caller's payment whitelist
     * @dev Removed recipients can no longer receive payments from the agent
     * @param recipient The address to remove from the whitelist
     * @custom:emits RecipientRemoved
     */
    function removeRecipient(address recipient) external {
        agentVaults[msg.sender].whitelist[recipient] = false;
        emit RecipientRemoved(msg.sender, recipient);
    }

    /**
     * @notice Executes a payment from the caller's vault to a whitelisted recipient
     * @dev Validates balance, daily limits, and whitelist status before execution
     * @param recipient The whitelisted address to receive the payment
     * @param amount The amount of MNEE tokens to transfer (must be > 0)
     * @param purpose Human-readable description of the payment purpose
     * @custom:throws InvalidAmount if amount is zero
     * @custom:throws InsufficientBalance if vault balance is insufficient
     * @custom:throws RecipientNotWhitelisted if recipient is not whitelisted
     * @custom:throws DailyLimitExceeded if payment would exceed daily limit
     * @custom:emits PaymentExecuted
     */
    function executePayment(
        address recipient,
        uint256 amount,
        string calldata purpose
    ) external nonReentrant {
        if (amount == 0) {
            revert InvalidAmount();
        }

        AgentVault storage vault = agentVaults[msg.sender];

        if (vault.balance < amount) {
            revert InsufficientBalance();
        }

        if (!vault.whitelist[recipient]) {
            revert RecipientNotWhitelisted();
        }

        // Reset daily spending counter if new day
        uint256 currentDay = block.timestamp / SECONDS_PER_DAY;
        if (currentDay > vault.lastResetDay) {
            vault.dailySpent = 0;
            vault.lastResetDay = currentDay;
        }

        // Check daily spending limit
        if (vault.dailySpent + amount > vault.dailyLimit) {
            revert DailyLimitExceeded();
        }

        // Update vault state
        vault.balance -= amount;
        vault.dailySpent += amount;

        // Execute token transfer
        MNEE_TOKEN.safeTransfer(recipient, amount);

        emit PaymentExecuted(msg.sender, recipient, amount, purpose);
    }

    /**
     * @notice Withdraws MNEE tokens from the caller's vault back to their address
     * @dev Allows agents to retrieve their deposited tokens
     * @param amount The amount of MNEE tokens to withdraw (must be > 0)
     * @custom:throws InvalidAmount if amount is zero
     * @custom:throws InsufficientBalance if vault balance is insufficient
     * @custom:emits Withdrawn
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert InvalidAmount();
        }

        AgentVault storage vault = agentVaults[msg.sender];
        
        if (vault.balance < amount) {
            revert InsufficientBalance();
        }

        vault.balance -= amount;
        MNEE_TOKEN.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Checks if a recipient is whitelisted for payments from a specific agent
     * @param agent The agent address to check whitelist for
     * @param recipient The recipient address to verify
     * @return isWhitelisted True if the recipient is whitelisted, false otherwise
     */
    function isWhitelisted(
        address agent,
        address recipient
    ) external view returns (bool isWhitelisted) {
        return agentVaults[agent].whitelist[recipient];
    }

    /**
     * @notice Calculates the remaining daily spending allowance for an agent
     * @dev Accounts for daily limit resets and current spending
     * @param agent The agent address to check allowance for
     * @return remainingAllowance The amount of MNEE tokens that can still be spent today
     */
    function getRemainingDailyAllowance(
        address agent
    ) external view returns (uint256 remainingAllowance) {
        AgentVault storage vault = agentVaults[agent];

        // Check if daily limit should be reset
        uint256 currentDay = block.timestamp / SECONDS_PER_DAY;
        if (currentDay > vault.lastResetDay) {
            return vault.dailyLimit;
        }

        return vault.dailyLimit > vault.dailySpent 
            ? vault.dailyLimit - vault.dailySpent 
            : 0;
    }

    /**
     * @notice Retrieves comprehensive vault information for an agent
     * @param agent The agent address to get information for
     * @return balance Current MNEE token balance in the vault
     * @return dailyLimit Maximum MNEE tokens that can be spent per day
     * @return dailySpent Amount of MNEE tokens spent in the current day
     */
    function getAgentInfo(
        address agent
    ) external view returns (
        uint256 balance,
        uint256 dailyLimit,
        uint256 dailySpent
    ) {
        AgentVault storage vault = agentVaults[agent];
        return (vault.balance, vault.dailyLimit, vault.dailySpent);
    }
}