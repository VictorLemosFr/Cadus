import { InvalidCepError } from "../../errors/InvalidCep";
import { type Either, success, failure } from "../../../shared/Either";

export class Cep {
    private _cep: string;

    constructor(cep: string) {
        this._cep = cep;
    }

    public static create(cep: string): Either<InvalidCepError, Cep> {
        if (Cep.noFieldExists(cep)) {
            return failure(new InvalidCepError(cep));
        }
        if (!Cep.isCorrectFormat(cep)) {
            return failure(new InvalidCepError(cep));
        }
        // Normaliza para 8 dígitos puros — o banco guarda VarChar(8) @unique,
        // então tudo precisa ser salvo no mesmo formato
        const cepNormalizado = cep.replace(/\D/g, "");
        return success(new Cep(cepNormalizado));
    }

    public static noFieldExists(cep: string): boolean {
        return cep.length === 0;
    }

    public static isCorrectFormat(cep: string): boolean {
        // Aceita com traço (50670-901) OU 8 dígitos puros (50670901)
        const comTraco = /^[0-9]{5}-[0-9]{3}$/;
        const semTraco = /^[0-9]{8}$/;
        return comTraco.test(cep) || semTraco.test(cep);
    }

    public get value(): string {
        return this._cep;
    }
}