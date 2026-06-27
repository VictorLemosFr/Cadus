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
        if (data instanceof Date) {
            if (isNaN(data.getTime())) {
                return failure(new InvalidDataError("data inválida"));
            }
            return success(new Data(data));
        }

        const dataNormalizada = data.trim();

        if (!Data.noFieldExistsDataError(dataNormalizada)) {
            return failure(new InvalidDataError(dataNormalizada));
        }
        if (!Data.formatDataError(dataNormalizada)) {
            return failure(new InvalidDataError(dataNormalizada));
        }

        const parts = dataNormalizada.split("/");
        const dia = Number(parts[0] ?? "0");
        const mes = Number(parts[1] ?? "0");
        const ano = Number(parts[2] ?? "0");
        const dateObj = new Date(ano, mes - 1, dia);

        return success(new Data(dateObj));
    }

    public static noFieldExistsDataError(data: string): boolean {
        if (data.length === 0) {
            return false;
        }
        return true;
    }

    public static formatDataError(data: string): boolean {
        const regExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!regExp.test(data)) {
            return false;
        }
        return true;
    }

    public get value(): Date {
        return this._data;
    }
}