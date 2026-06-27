import { InvalidDataError } from "../../domain/errors/InvalidData"
import { type Either, success, failure} from "../Either"
export class Data {
    private readonly _data: Date;
    private _stringData: string;
    
    constructor(data: Date) {
        this._data = data;
        this._stringData = data.toDateString();
    }

    public static create(data: string | Date): Either<InvalidDataError, Data> {
        const dataNormalizada: string = data instanceof Date? data.toLocaleDateString('pt-BR'): data;

        if (!Data.noFieldExistsDataError(dataNormalizada)){
            return failure(new InvalidDataError(dataNormalizada));
        }
        if (!Data.formatDataError(dataNormalizada)) {
            return failure(new InvalidDataError(dataNormalizada));
        }

        return success(new Data(new Date(data)));
    }


    public static noFieldExistsDataError (data: string): boolean{
        if (data.length === 0) {
            return false;
        }
        return true;
    }

    // Validação de formato de Data no padrão brasileiro
    public static formatDataError (data: string): boolean {
        const regExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!regExp.test(data)) {
            return false;
        }
        return true;
    }

    public get value (): Date {
        return this._data;
    }
}