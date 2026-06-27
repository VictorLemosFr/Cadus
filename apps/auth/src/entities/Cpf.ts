import { InvalidCpfError } from './errors/InvalidCpfError'
import { type Either, success, failure } from '../shared/Either'

export class Cpf {
    private readonly cpf: string;
    constructor(cpf: string) {
        this.cpf = cpf;
    }

    get value (): string {
        return this.cpf;
    }

    get valueFormatado(): string | undefined {
        if (this.cpf === undefined) return undefined;
        let valor: string = this.cpf.slice(0,3) + "." + this.cpf.slice(3,6) + "." + this.cpf.slice(6,9) + "-" + this.cpf.slice(9,12);
        return valor;
    }

    static create(cpf: string): Either<InvalidCpfError, Cpf> {
    if (!cpf || cpf.length === 0) {
        return failure(new InvalidCpfError(cpf))
    }
    if (!Cpf.isFormatCpfError(cpf)) {
        return failure(new InvalidCpfError(cpf))
    }
    if (!Cpf.existsCpfValitaion(cpf)) {
        return failure(new InvalidCpfError(cpf))
    }

    const cpfNormalizado = cpf.replace(/\D/g, '')
    return success(new Cpf(cpfNormalizado))
}

    public static isFormatCpfError (cpf: string): boolean {
        // Aceita com máscara (108.580.204-32) OU 11 dígitos puros (10858020432).
        // A validação dos dígitos verificadores acontece em existsCpfValitaion.
        const comMascara = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const semMascara = /^\d{11}$/;
        return comMascara.test(cpf) || semMascara.test(cpf);
    }

    public static noFieldExistsValidation (cpf: string): boolean{
        if (cpf.length === 0) return true;
        return false;
    }

    public static existsCpfValitaion (cpf: string): boolean {
        const regExp = /[^\d]/g;
        cpf = cpf.replace(regExp, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Primeiro dígito
        let calcPDigito: number =  0;
        for (let i = 0; i < 9; i ++){
            calcPDigito += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = calcPDigito % 11;
        let digitoP = resto < 2 ? 0 : 11 - resto;
        if (parseInt(cpf.charAt(9)) !== digitoP) return false;
        
        // Segundo dígito
        let calcUDigito = 0;
        for (let i = 0; i < 10; i++) {
            calcUDigito += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = calcUDigito % 11;
        let digitoU = resto < 2 ? 0 : 11 - resto;
        if (parseInt(cpf.charAt(10)) !== digitoU) return false;

        return true;
    }
}