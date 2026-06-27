import { DomainError } from './DomainError'

export class InvalidCpfError extends DomainError {
  constructor(cpf: string) {
    super(`CPF inválido: ${cpf}`)
  }
}
