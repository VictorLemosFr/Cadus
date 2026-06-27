import { InvalidGeneroError } from "../../errors/InvalidGenero"
import { type Either, success, failure} from "../../../shared/Either"
import { GeneroEnum } from "./enums/GeneroEnum";
export class Genero {
    private readonly _genero: string;
    constructor (genero: string){
        this._genero = genero;
    }
    
    public static create (genero:string): Either<InvalidGeneroError, Genero> {

        if (Genero.noFieldExistsGeneroError(genero)) {
            return failure(new InvalidGeneroError(genero));
        }
        if (!Genero.noFormatGeneroError(genero)) {
            return failure(new InvalidGeneroError(genero));
        }

        return success(new Genero(genero));
    }

    public static noFormatGeneroError (genero: string): boolean {
        const generoNormalizado: string = genero.toUpperCase();
        
        if (!(generoNormalizado in GeneroEnum)) return false;
        return true;

    }

    public static noFieldExistsGeneroError (genero: string): boolean {
        if (genero.length > 0) return false;
        return true;
    }

    public get value(): string {
        return this._genero;
    }
}