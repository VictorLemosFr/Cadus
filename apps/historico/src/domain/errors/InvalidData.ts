import { DomainError } from "./DomainError";

export class InvalidDataError extends DomainError {
  constructor(message: string) {
    super(`Data inválida: ${message}`);
  }
}
