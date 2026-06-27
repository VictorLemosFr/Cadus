import { InvalidLogradouroError } from "../../errors/InvalidLogradouro";
import { type Either, success, failure } from "../../../shared/Either";

export class Logradouro {
    private _logradouro: string | undefined;
    constructor (logradouro: string | undefined) {
        this._logradouro = logradouro;
    }

    public static create (logradouro: string | undefined): Either<InvalidLogradouroError, Logradouro> {
        if (typeof logradouro === "string" && logradouro.trim().length === 0) {
            return failure(new InvalidLogradouroError(logradouro));
        }

        return success(new Logradouro(logradouro));
    }

    public get value (): string | undefined {
        return this._logradouro;
    }
}