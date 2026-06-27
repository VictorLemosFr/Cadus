import type { DomainError } from "./DomainError";

export class InvalidNomeError extends Error implements DomainError {
    constructor(nome: string) {
        super(`O nome ${nome} é inválido.`);
        this.name = "InvalidNomeError";
    }
}