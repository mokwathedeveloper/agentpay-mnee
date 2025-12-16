# Agent Communication Protocols

## MNEE Protocol Specification
- **Message Format**: JSON-based with digital signatures
- **Authentication**: Public key cryptography
- **Transport**: HTTPS with WebSocket fallback
- **Retry Logic**: Exponential backoff with circuit breaker

## Payment Flow
1. Agent initiates payment request
2. System validates agent credentials
3. Payment gateway processes transaction
4. Confirmation sent to both agents
5. Transaction logged for audit

## Error Handling
- Invalid agent credentials → 401 Unauthorized
- Insufficient funds → 402 Payment Required
- Gateway timeout → 503 Service Unavailable
- Invalid transaction → 400 Bad Request

## Rate Limiting
- 100 requests per minute per agent
- 10 payment transactions per minute per agent
- Burst allowance of 20 requests