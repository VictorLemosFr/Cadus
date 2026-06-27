import { InvalidSenhaError } from './errors/InvalidSenhaError'
import { type Either, success, failure } from '../shared/Either'

export class Senha {
  private readonly _senha: string

  constructor(senha: string) {
    this._senha = senha
  }

  public static create(senha: string): Either<InvalidSenhaError, Senha> {
    if (!senha || senha.length === 0) {
      return failure(new InvalidSenhaError())
    }
    if (senha.length < 8) {
      return failure(new InvalidSenhaError())
    }
    return success(new Senha(senha))
  }

  public get value(): string {
    return this._senha
  }
}
