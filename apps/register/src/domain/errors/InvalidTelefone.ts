import type { DomainError } from "./DomainError";

export class InvalidTelefoneError extends Error implements DomainError {
    constructor(telefone: string) {
        super(`O telefone ${telefone} é inválido. Ele deve conter apenas números e ter entre 10 e 11 dígitos.`);
        this.name = "InvalidTelefoneError";
    }
}