import type { DomainError } from "./DomainError";

export class InvalidEmailError extends Error implements DomainError {
    constructor(email: string) {
        super(`O email ${email} é inválido.`);
        this.name = "InvalidEmailError";
    }
}