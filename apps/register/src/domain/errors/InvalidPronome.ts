import type { DomainError } from "./DomainError";

export class InvalidPronomeError extends Error implements DomainError {
    constructor (pronome: string){
        super(`O pronome ${pronome} é inválido.`);
        this.name = "InvalidPronomeError";
    }

}