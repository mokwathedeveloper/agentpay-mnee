'use client'

import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react"

interface TransactionStatusProps {
  status: 'pending' | 'confirmed' | 'failed'
  txHash?: string
  error?: string
}

export default function TransactionStatus({ status, txHash, error }: TransactionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending',
          variant: 'secondary' as const,
          color: 'text-yellow-500'
        }
      case 'confirmed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Confirmed',
          variant: 'default' as const,
          color: 'text-green-500'
        }
      case 'failed':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'Failed',
          variant: 'destructive' as const,
          color: 'text-red-500'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className="flex items-center gap-1">
        <span className={config.color}>{config.icon}</span>
        {config.label}
      </Badge>
      
      {txHash && status !== 'failed' && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          View on Etherscan
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      
      {error && status === 'failed' && (
        <span className="text-sm text-red-400">
          {error}
        </span>
      )}
    </div>
  )
}