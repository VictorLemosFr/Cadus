import { InvalidIdError } from "../../errors/InvalidId";
import { type Either, success, failure } from "../../../shared/Either";
import { ValueObject } from "../../../shared/value-objects/ValueObject";

export interface EnderecoIdProps {
    id: string
}

export class EnderecoId extends ValueObject<EnderecoIdProps> {

    constructor (props: EnderecoIdProps) {
        super(props);
    }
    
    public static create (id: string): Either<InvalidIdError, EnderecoId>{

        if (EnderecoId.noFieldExistsIdError(id)) {
            return failure(new InvalidIdError(id));
        }
        if (!EnderecoId
            .noFormatIdError(id)) {
            return failure(new InvalidIdError(id));
        }
        return success(new EnderecoId({id}));
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

    public static generate (): EnderecoId {
        return new EnderecoId({id: crypto.randomUUID()});
    }

    public static reconstitute (id: string): Either<InvalidIdError, EnderecoId> {
        return success(new EnderecoId({id}));
    }
    
    public get value (): string {
        return this.props.id;
    }

}