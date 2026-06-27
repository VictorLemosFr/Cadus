import type { DomainError } from "./DomainError";

export class InvalidNumeroError extends Error implements DomainError {
    constructor (numero: string) {
        super (`O Número ${numero} é inválido.`);
        this.name = numero;
    }
}