import { InvalidPronomeError } from "../../errors/InvalidPronome"
import { type Either, success, failure } from "../../../shared/Either"
import { PronomeEnum } from "./enums/PronomeEnum";

export class Pronome {
    private readonly _pronome: string;
    constructor (pronome: string) {
        this._pronome = pronome;
    }

    public static create (pronome: string): Either<InvalidPronomeError, Pronome> {
        if (!Pronome.validation(pronome)) {
            return failure(new InvalidPronomeError(pronome));
        }
        return success(new Pronome(pronome));
    }

    public static validation (pronome: string) {
        if (!(pronome in PronomeEnum)) return false;
        return true;
    }

    public get value (): string {
        return this._pronome;
    }
}