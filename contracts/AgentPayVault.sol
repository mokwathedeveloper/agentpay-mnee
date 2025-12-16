// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentPayVault
 * @dev Secure vault for autonomous agent payments using MNEE token
 * Features: deposits, daily limits, whitelisting, secure payments
 */
contract AgentPayVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // MNEE token contract address (mainnet)
    IERC20 public constant MNEE_TOKEN = IERC20(0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF);

    // Agent vault data structure
    struct AgentVault {
        uint256 balance;           // Current MNEE balance
        uint256 dailyLimit;       // Daily spending limit
        uint256 dailySpent;       // Amount spent today
        uint256 lastResetDay;     // Last day counter was reset
        mapping(address => bool) whitelist; // Whitelisted recipients
    }

    // Agent vaults mapping
    mapping(address => AgentVault) public agentVaults;

    // Events for transparency and monitoring
    event Deposited(address indexed agent, uint256 amount);
    event DailyLimitSet(address indexed agent, uint256 newLimit);
    event RecipientWhitelisted(address indexed agent, address indexed recipient);
    event RecipientRemoved(address indexed agent, address indexed recipient);
    event PaymentExecuted(address indexed agent, address indexed recipient, uint256 amount, string purpose);
    event Withdrawn(address indexed agent, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Deposit MNEE tokens into agent vault
     * @param amount Amount of MNEE to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer MNEE from agent to vault
        MNEE_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update agent balance
        agentVaults[msg.sender].balance += amount;
        
        emit Deposited(msg.sender, amount);
    }

    /**
     * @dev Set daily spending limit for agent
     * @param limit New daily limit in MNEE tokens
     */
    function setDailyLimit(uint256 limit) external {
        agentVaults[msg.sender].dailyLimit = limit;
        emit DailyLimitSet(msg.sender, limit);
    }

    /**
     * @dev Add recipient to agent's whitelist
     * @param recipient Address to whitelist
     */
    function addRecipient(address recipient) external {
        require(recipient != address(0), "Invalid recipient address");
        agentVaults[msg.sender].whitelist[recipient] = true;
        emit RecipientWhitelisted(msg.sender, recipient);
    }

    /**
     * @dev Remove recipient from agent's whitelist
     * @param recipient Address to remove
     */
    function removeRecipient(address recipient) external {
        agentVaults[msg.sender].whitelist[recipient] = false;
        emit RecipientRemoved(msg.sender, recipient);
    }

    /**
     * @dev Execute payment to whitelisted recipient
     * @param recipient Whitelisted recipient address
     * @param amount Amount of MNEE to send
     * @param purpose Payment purpose description
     */
    function executePayment(address recipient, uint256 amount, string calldata purpose) external nonReentrant {
        AgentVault storage vault = agentVaults[msg.sender];
        
        // Validation checks
        require(amount > 0, "Amount must be greater than 0");
        require(vault.balance >= amount, "Insufficient balance");
        require(vault.whitelist[recipient], "Recipient not whitelisted");
        
        // Reset daily counter if new day
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > vault.lastResetDay) {
            vault.dailySpent = 0;
            vault.lastResetDay = currentDay;
        }
        
        // Check daily limit
        require(vault.dailySpent + amount <= vault.dailyLimit, "Daily limit exceeded");
        
        // Update balances
        vault.balance -= amount;
        vault.dailySpent += amount;
        
        // Execute transfer
        MNEE_TOKEN.safeTransfer(recipient, amount);
        
        emit PaymentExecuted(msg.sender, recipient, amount, purpose);
    }

    /**
     * @dev Withdraw MNEE tokens from vault
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        AgentVault storage vault = agentVaults[msg.sender];
        require(amount > 0, "Amount must be greater than 0");
        require(vault.balance >= amount, "Insufficient balance");
        
        vault.balance -= amount;
        MNEE_TOKEN.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Check if recipient is whitelisted for agent
     * @param agent Agent address
     * @param recipient Recipient address to check
     * @return bool Whitelist status
     */
    function isWhitelisted(address agent, address recipient) external view returns (bool) {
        return agentVaults[agent].whitelist[recipient];
    }

    /**
     * @dev Get agent's remaining daily allowance
     * @param agent Agent address
     * @return uint256 Remaining daily allowance
     */
    function getRemainingDailyAllowance(address agent) external view returns (uint256) {
        AgentVault storage vault = agentVaults[agent];
        
        // Reset if new day
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > vault.lastResetDay) {
            return vault.dailyLimit;
        }
        
        return vault.dailyLimit > vault.dailySpent ? vault.dailyLimit - vault.dailySpent : 0;
    }

    /**
     * @dev Get agent vault information
     * @param agent Agent address
     * @return balance Current MNEE balance
     * @return dailyLimit Daily spending limit
     * @return dailySpent Amount spent today
     */
    function getAgentInfo(address agent) external view returns (uint256 balance, uint256 dailyLimit, uint256 dailySpent) {
        AgentVault storage vault = agentVaults[agent];
        return (vault.balance, vault.dailyLimit, vault.dailySpent);
    }
}