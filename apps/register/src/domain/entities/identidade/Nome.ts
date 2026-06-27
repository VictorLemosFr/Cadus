import { InvalidNomeError } from "../../errors/InvalidNome"
import { type Either, success, failure} from "../../../shared/Either"

export class Nome {
    private readonly _nome: string;
    constructor (nome: string) {
        this._nome = nome;
    }

    public static create(nome: string): Either<InvalidNomeError, Nome> {
        if (!Nome.validation(nome)) {
            return failure(new InvalidNomeError(nome));
        }
        return success(new Nome(nome));
    }

    public static validation (name: string): boolean {
        if (!name || name.trim().length < 2 || name.trim().length > 255) {
            return false;
        }
        return true;
    }
    
    public get value (): string {
        return this._nome;
    }
}