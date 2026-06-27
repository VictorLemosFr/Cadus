import { InvalidComplementoError } from "../../errors/InvalidComplemento";
import { type Either, success, failure } from "../../../shared/Either";

export class Complemento {
    private _complemento: string | undefined;
    constructor (complemento: string | undefined) {
        this._complemento = complemento;
    }

    public static create (complemento: string | undefined): Either<InvalidComplementoError, Complemento> {
        return success(new Complemento(complemento));
    }


    public get value () {
        return this._complemento;
    }
}