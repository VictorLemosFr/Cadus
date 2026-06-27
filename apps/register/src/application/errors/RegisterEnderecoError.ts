import type { UseCaseError } from "./UseCaseError";

export class RegisterEnderecoError extends Error implements UseCaseError {
    constructor (textError: string) {
        super(`Erro de registro de Endereco. ${textError}`);
        this.name = "RegisterEnderecoError";
    }
}

export class EnderecoAlreadyExists extends RegisterEnderecoError {
    constructor (textError: string) {
        super(`${textError}`);
        this.name = "EnderecoAlreadyExists";
    }
}
