import { InvalidIdError } from "../../errors/InvalidId";
import { type Either, success, failure } from "../../../shared/Either";
import { ValueObject } from "../../../shared/value-objects/ValueObject";
import crypto from "node:crypto";


export interface IdentidadeIdProps {
    id: string;
}

export class IdentidadeId extends ValueObject<IdentidadeIdProps>{
 
    constructor (props: IdentidadeIdProps) {
        super(props);
    }
    
    public static create (id: string): Either<InvalidIdError, IdentidadeId>{

        if (IdentidadeId.noFieldExistsIdError(id)) {
            return failure(new InvalidIdError(id));
        }
        if (!IdentidadeId
            .noFormatIdError(id)) {
            return failure(new InvalidIdError(id));
        }
        return success(new IdentidadeId({id}));
    }

    public static noFieldExistsIdError (id: string): boolean {
        if (id.length > 0) {
            return false;
        }
        return true;
    }

    public static noFormatIdError (id: string): boolean {
        const regExp: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!regExp.test(id)) {
            return false;
        }
        return true
    }

    public static generate (): IdentidadeId {
        return new IdentidadeId({id: crypto.randomUUID()});
    }

    public static reconstitute (id: string): Either<InvalidIdError, IdentidadeId> {
        return success(new IdentidadeId({id}));
    }
    
    public get value (): string {
        return this.props.id;
    }

}