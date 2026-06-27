import { DomainError } from "./DomainError";

export class InvalidInstituicaoError extends DomainError {
  constructor(message: string) {
    super(`Instituição inválida: ${message}`);
  }
}
