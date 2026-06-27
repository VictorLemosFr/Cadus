import { type DomainError } from "./DomainError";

export class InvalidIdError extends Error implements DomainError {
    constructor (id: string) {
        super(`O id ${id} é inválido.`);
        this.name = id;
    }
}