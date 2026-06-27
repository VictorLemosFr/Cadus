import type { DomainError } from "./DomainError";

export class InvalidComplementoError extends Error implements DomainError {
    constructor (complemento: string) {
        super (`O Complemento ${complemento} é inválido.`);
        this.name = complemento;
    }
}