import type { DomainError } from "./DomainError";

export class InvalidGeneroError extends Error implements DomainError {
    constructor(genero: string) {
        super(`O gênero ${genero} é inválido.`);
        this.name = "InvalidGeneroError";
    }
}