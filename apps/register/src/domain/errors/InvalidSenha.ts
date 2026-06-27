import type { DomainError } from "./DomainError";

export class InvalidSenhaError extends Error implements DomainError {
    constructor(senha: string) {
        super(`A senha ${senha} é inválida. Ela deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.`);
        this.name = "InvalidSenhaError";
    }
}