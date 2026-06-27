import { type Either, failure, success } from "../../../shared/Either";
import { InvalidIdError } from "../../errors/InvalidId";

export class ConsultaId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(id: string): Either<InvalidIdError, ConsultaId> {
    if (!id || id.trim().length === 0) {
      return failure(new InvalidIdError("ID não pode ser vazio"));
    }
    return success(new ConsultaId(id));
  }

  public static reconstitute(id: string): Either<InvalidIdError, ConsultaId> {
    return ConsultaId.create(id);
  }

  public get value(): string {
    return this._value;
  }
}
