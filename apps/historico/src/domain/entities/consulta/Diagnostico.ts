import { type Either, failure, success } from "../../../shared/Either";
import { InvalidDiagnosticoError } from "../../errors/InvalidDiagnostico";

export class Diagnostico {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Either<InvalidDiagnosticoError, Diagnostico> {
    if (!value || value.trim().length === 0) {
      return failure(new InvalidDiagnosticoError("não pode ser vazio"));
    }
    return success(new Diagnostico(value.trim()));
  }

  public get value(): string {
    return this._value;
  }
}
