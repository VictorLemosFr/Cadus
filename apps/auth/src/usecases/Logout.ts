import { type Either, success } from '../shared/Either'
import type { ISessaoRepositorio } from '../infra/database/ISessaoRepositorio'

export interface LogoutDTO {
  token: string
}

export class LogoutUseCase {
  constructor(private readonly sessaoRepo: ISessaoRepositorio) {}

  async execute({ token }: LogoutDTO): Promise<Either<Error, void>> {
    await this.sessaoRepo.invalidar(token)
    return success(undefined)
  }
}
