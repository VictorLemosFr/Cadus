import type { DomainError } from "./DomainError";

export class InvalidCpfError extends Error implements DomainError {
    constructor(textError: string) {
        super(`O CPF é inválido.\n${textError}`);
        this.name = "InvalidCpfError";
    }
}


export class NoFieldCpfError extends InvalidCpfError {
    constructor () {
        super(`O campo CPF não existe.`);
        this.name = "NoFieldCpfError";
    }
}

export class NoExistCpfError extends InvalidCpfError {
    constructor (cpf: string) {
        super(`O CPF ${cpf} não existe.`);
        this.name = "NoExistsCpfError";
    }
}

export class FormatCpfError extends InvalidCpfError {
    constructor (cpf: string) {
        super(`O formato do CPF "${cpf}" não é correto.`);
        this.name = "FormatCpfError";
    }
}