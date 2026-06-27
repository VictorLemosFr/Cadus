import { type Either, failure, success } from "../../../shared/Either";
import { InvalidMotivoConsultaError } from "../../errors/InvalidMotivoConsulta";

export class MotivoConsulta {
  private readonly _value: string;
  private static readonly MAX_LENGTH = 500;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Either<InvalidMotivoConsultaError, MotivoConsulta> {
    if (!value || value.trim().length === 0) {
      return failure(new InvalidMotivoConsultaError("não pode ser vazio"));
    }
    if (value.trim().length > MotivoConsulta.MAX_LENGTH) {
      return failure(new InvalidMotivoConsultaError(`máximo de ${MotivoConsulta.MAX_LENGTH} caracteres`));
    }
    return success(new MotivoConsulta(value.trim()));
  }

  public get value(): string {
    return this._value;
  }
}
