import { DomainError } from './DomainError'

export class InvalidTokenError extends DomainError {
  constructor() {
    super('Token inválido ou expirado')
  }
}
