import { Cpf } from '../entities/Cpf'
import { Senha } from '../entities/Senha'
import { type Either, failure, success } from '../shared/Either'
import type { IRegisterClient } from '../infra/http/IRegisterClient'
import type { ITentativaLoginRepositorio } from '../infra/database/ITentativaLoginRepositorio'
import type { ISessaoRepositorio } from '../infra/database/ISessaoRepositorio'
import { JwtService } from '../infra/auth/JwtService'
import bcrypt from 'bcrypt'

export interface LoginDTO {
  cpf: string
  senha: string
}

export interface LoginResultado {
  token: string
}

export class LoginUseCase {
  constructor(
    private readonly registerClient: IRegisterClient,
    private readonly tentativaRepo: ITentativaLoginRepositorio,
    private readonly jwtService: JwtService,
    private readonly sessaoRepo: ISessaoRepositorio
  ) {}

  async execute({ cpf, senha }: LoginDTO): Promise<Either<Error, LoginResultado>> {
    // Passo 1: valida formato do CPF
    const cpfResult = Cpf.create(cpf)
    if (cpfResult.isError()) {
      return failure(cpfResult.value)
    }

    // Passo 2: valida formato da senha
    const senhaResult = Senha.create(senha)
    if (senhaResult.isError()) {
      return failure(senhaResult.value)
    }

    const cpfNormalizado = cpfResult.value.value

    // Passo 3: busca usuário no register
    const usuario = await this.registerClient.buscarUsuarioPorCpf(cpfNormalizado)
    if (!usuario) {
      return failure(new Error('CPF não cadastrado'))
    }

    // Passo 4: compara senha com hash
    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)

    // Passo 5: verifica bloqueio e tentativas
    const tentativa = await this.tentativaRepo.buscarPorCpf(cpfNormalizado)

    if (tentativa?.bloqueadoAte && tentativa.bloqueadoAte > new Date()) {
      return failure(new Error('Usuário bloqueado temporariamente'))
    }

    if (!senhaCorreta) {
      const atualizado = await this.tentativaRepo.incrementar(cpfNormalizado)
      if (atualizado.tentativas >= 5) {
        await this.tentativaRepo.bloquear(cpfNormalizado)
        return failure(new Error('Usuário bloqueado por 10 minutos'))
      }
      return failure(new Error('Senha incorreta'))
    }

    // Login bem sucedido — reseta tentativas
    await this.tentativaRepo.resetar(cpfNormalizado)

    // Passo 6: gera JWT e cria sessão
    const token = this.jwtService.gerar({ cpf: cpfNormalizado })
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
    await this.sessaoRepo.criar(cpfNormalizado, token, expiresAt)

    return success({ token })
  }
}