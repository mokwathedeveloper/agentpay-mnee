/**
 * Transaction Manager for Production-Grade Transaction Handling
 * Tracks transaction lifecycle: submitted -> mined -> confirmed/reverted
 */

class TransactionManager {
  constructor(provider) {
    this.provider = provider;
    this.pendingTransactions = new Map();
  }

  /**
   * Submit transaction and track its lifecycle
   */
  async submitTransaction(contractMethod, description, options = {}) {
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`📤 [${txId}] Submitting: ${description}`);
    
    try {
      // Submit transaction
      const tx = await contractMethod;
      
      this.pendingTransactions.set(txId, {
        hash: tx.hash,
        description,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        gasLimit: tx.gasLimit?.toString(),
        gasPrice: tx.gasPrice?.toString()
      });
      
      console.log(`✅ [${txId}] Submitted: ${tx.hash}`);
      console.log(`⏳ [${txId}] Waiting for confirmation...`);
      
      // Wait for mining
      const receipt = await tx.wait();
      
      // Update transaction status
      const txData = this.pendingTransactions.get(txId);
      txData.status = receipt.status === 1 ? 'confirmed' : 'reverted';
      txData.blockNumber = receipt.blockNumber;
      txData.gasUsed = receipt.gasUsed.toString();
      txData.confirmedAt = new Date().toISOString();
      
      if (receipt.status === 1) {
        console.log(`🎉 [${txId}] CONFIRMED in block ${receipt.blockNumber}`);
        console.log(`⛽ [${txId}] Gas used: ${receipt.gasUsed.toString()}`);
        
        return {
          success: true,
          txId,
          hash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          receipt
        };
      } else {
        console.error(`❌ [${txId}] REVERTED in block ${receipt.blockNumber}`);
        
        return {
          success: false,
          txId,
          hash: tx.hash,
          blockNumber: receipt.blockNumber,
          reason: 'Transaction reverted',
          receipt
        };
      }
      
    } catch (error) {
      // Handle transaction errors
      const txData = this.pendingTransactions.get(txId);
      if (txData) {
        txData.status = 'failed';
        txData.error = error.message;
        txData.failedAt = new Date().toISOString();
      }
      
      console.error(`💥 [${txId}] FAILED: ${error.message}`);
      
      // Extract revert reason if available
      let revertReason = 'Unknown error';
      if (error.reason) {
        revertReason = error.reason;
      } else if (error.message.includes('revert')) {
        const match = error.message.match(/revert (.+)/);
        if (match) revertReason = match[1];
      }
      
      return {
        success: false,
        txId,
        reason: revertReason,
        error: error.message
      };
    }
  }

  /**
   * Get transaction status by ID
   */
  getTransactionStatus(txId) {
    return this.pendingTransactions.get(txId);
  }

  /**
   * Get all transaction history
   */
  getTransactionHistory() {
    return Array.from(this.pendingTransactions.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  /**
   * Clear old transactions (keep last 100)
   */
  cleanup() {
    if (this.pendingTransactions.size > 100) {
      const entries = Array.from(this.pendingTransactions.entries());
      const toKeep = entries.slice(-100);
      this.pendingTransactions.clear();
      toKeep.forEach(([id, data]) => {
        this.pendingTransactions.set(id, data);
      });
    }
  }
}

module.exports = TransactionManager;