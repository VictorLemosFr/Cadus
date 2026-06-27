import { InvalidNumeroError } from "../../errors/InvalidNumero";
import { type Either, success, failure } from "../../../shared/Either";

export class Numero {
    private _numero: number;
    constructor (numero: number) {
        this._numero = numero;
    }

    public static create (numero: number): Either<InvalidNumeroError, Numero> {
        if (!Numero.isNoNegativeNumber(numero)) {
            return failure(new InvalidNumeroError(numero.toString()));
        }
        return success(new Numero(numero));
    }

    public static isNoNegativeNumber (numero: number): boolean {
        if (numero < 0) {
            return false;
        }
        return true;
    }
    
    public get value (): number {
        return this._numero;
    }
}