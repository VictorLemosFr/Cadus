import { DomainError } from './DomainError'

export class InvalidSenhaError extends DomainError {
  constructor() {
    super('Senha inválida')
  }
}
