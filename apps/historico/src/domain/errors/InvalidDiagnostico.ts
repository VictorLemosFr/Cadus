import { DomainError } from "./DomainError";

export class InvalidDiagnosticoError extends DomainError {
  constructor(message: string) {
    super(`Diagnóstico inválido: ${message}`);
  }
}
