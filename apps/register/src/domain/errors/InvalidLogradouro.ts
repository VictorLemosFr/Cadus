import type { DomainError } from "./DomainError";

export class InvalidLogradouroError extends Error implements DomainError {
    constructor (logradouro: string) {
        super(`O Logradouro ${logradouro} é inválido.`);
        this.name = logradouro;
    }
}