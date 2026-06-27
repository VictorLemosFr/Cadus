import type { UseCaseError } from "./UseCaseError";

export class RegisterIdentidadeError extends Error implements UseCaseError {
    constructor (textError: string) {
        super(`Erro de registro de Identidade. ${textError}`);
        this.name = `RegisterIdentidadeError`
    }
}

export class IdentidadeAlreadyExistsError extends RegisterIdentidadeError {
    constructor (textError: string) {
        super(`Identidade ja existe.`);
        this.name = "IdentidadeAlreadyExists";
    }
}

