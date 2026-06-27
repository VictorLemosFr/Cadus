import { InvalidTelefoneError } from "../../errors/InvalidTelefone"
import { type Either, success, failure} from "../../../shared/Either"
export class Telefone {
    private readonly _telefone: string;

    constructor (telefone: string){
        this._telefone = telefone;
    }

    public static create (telefone: string): Either<InvalidTelefoneError, Telefone> {
        if (Telefone.noFieldExists(telefone)) {
            return failure(new InvalidTelefoneError(telefone));
        }
        if (!Telefone.isFormat(telefone)){
            return failure(new InvalidTelefoneError(telefone));
        }
        return success (new Telefone(telefone));
    }

    public static noFieldExists (telefone: string): boolean {
        if (telefone.length > 0) {
            return false;
        }
        return true;
    }

    public static isFormat (telefone: string): boolean {
        const regExp: RegExp = /^(\()?[0-9]{2}(\))?[\s]?[0-9]{4,5}[-]?[0-9]{4}$/;
        if (!regExp.test(telefone)) {
            return false;
        }
        return true;
    }

    public get value (): string {
        return this._telefone;
    }
}