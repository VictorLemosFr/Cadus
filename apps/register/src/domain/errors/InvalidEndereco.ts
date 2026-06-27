import type { DomainError } from "./DomainError";

export class InvalidEnderecoError extends Error implements DomainError {
    constructor (endereco: string ) {
        super(`O endereço ${endereco} é inválido.`)
        this.name = endereco;
    }
}