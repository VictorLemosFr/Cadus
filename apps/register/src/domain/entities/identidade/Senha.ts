import { InvalidSenhaError } from "../../errors/InvalidSenha"
import { type Either, success, failure} from "../../../shared/Either"
export class Senha {
    private readonly _senha;
    constructor (senha: string) {
        this._senha = senha;
    }

    public static create (senha: string): Either<InvalidSenhaError, Senha> {
        if (Senha.noFieldExists(senha)) {
            return failure(new InvalidSenhaError(senha));
        }
        if (!Senha.isFormat(senha)){
            return failure(new InvalidSenhaError(senha));
        }
        return success(new Senha(senha));
    }

    public static noFieldExists (senha: string): boolean {
        if (senha.length > 0) {
            return false;
        }
        return true;
    }

    public static isFormat (senha: string): boolean {
        if (senha.length !== 60 ) {
            return false;
        }
        return true;
    }

    public get value (): string {
        return this._senha;
    }
}