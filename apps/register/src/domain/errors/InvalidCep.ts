import type { DomainError } from "./DomainError";

export class InvalidCepError extends Error implements DomainError {
    constructor (cep: string) {
        super(`O Cep ${cep} é inválido.`);
        this.name = cep;

    }

}