import { DomainError } from "./DomainError";

export class InvalidMotivoConsultaError extends DomainError {
  constructor(message: string) {
    super(`Motivo de consulta inválido: ${message}`);
  }
}
