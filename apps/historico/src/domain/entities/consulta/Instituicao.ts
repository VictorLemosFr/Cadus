import { type Either, failure, success } from "../../../shared/Either";
import { InvalidInstituicaoError } from "../../errors/InvalidInstituicao";

export class Instituicao {
  private readonly _value: string;
  private static readonly MAX_LENGTH = 200;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Either<InvalidInstituicaoError, Instituicao> {
    if (!value || value.trim().length === 0) {
      return failure(new InvalidInstituicaoError("não pode ser vazia"));
    }
    if (value.trim().length > Instituicao.MAX_LENGTH) {
      return failure(new InvalidInstituicaoError(`máximo de ${Instituicao.MAX_LENGTH} caracteres`));
    }
    return success(new Instituicao(value.trim()));
  }

  public get value(): string {
    return this._value;
  }
}
