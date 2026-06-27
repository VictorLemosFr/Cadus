import type { DomainError } from "./DomainError";

export class InvalidDataError extends Error implements DomainError {
    constructor(data: string) {
        super(`A data ${data} é inválida.`);
        this.name = "InvalidDataError";
    }
}