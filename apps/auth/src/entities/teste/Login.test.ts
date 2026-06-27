import { describe, test, expect } from 'vitest'
import { LoginUseCase } from '../../usecases/Login'
import type { IRegisterClient } from '../../infra/http/IRegisterClient'
import type { ITentativaLoginRepositorio } from '../../infra/database/ITentativaLoginRepositorio'
import type { ISessaoRepositorio } from '../../infra/database/ISessaoRepositorio'
import { JwtService } from '../../infra/auth/JwtService'
import bcrypt from 'bcrypt'

const senhaHash = await bcrypt.hash('minhasenha123', 10)

const mockRegisterClient: IRegisterClient = {
  async buscarUsuarioPorCpf(cpf: string) {
    if (cpf === '52998224725') {
      return { cpf, senhaHash, email: 'victor@email.com' }
    }
    return null
  }
}

const mockTentativaRepo: ITentativaLoginRepositorio = {
  async buscarPorCpf() { return null },
  async incrementar(cpf) { return { cpf, tentativas: 1, bloqueadoAte: null } },
  async bloquear() {},
  async resetar() {}
}

const mockSessaoRepo: ISessaoRepositorio = {
  async criar() {},
  async buscarPorToken() { return { ativo: true } },
  async invalidar() {}
}

const jwtService = new JwtService()

describe('LoginUseCase', () => {
  const usecase = new LoginUseCase(mockRegisterClient, mockTentativaRepo, jwtService, mockSessaoRepo)

  test('deve falhar com CPF inválido', async () => {
    const resultado = await usecase.execute({
      cpf: '111.111.111-11',
      senha: 'minhasenha123'
    })
    expect(resultado.isError()).toBe(true)
  })

  test('deve falhar com senha muito curta', async () => {
    const resultado = await usecase.execute({
      cpf: '529.982.247-25',
      senha: 'abc'
    })
    expect(resultado.isError()).toBe(true)
  })

  test('deve falhar com CPF não cadastrado', async () => {
    const resultado = await usecase.execute({
      cpf: '123.456.789-09',
      senha: 'minhasenha123'
    })
    expect(resultado.isError()).toBe(true)
  })

  test('deve falhar com senha incorreta', async () => {
    const resultado = await usecase.execute({
      cpf: '529.982.247-25',
      senha: 'senhaerrada123'
    })
    expect(resultado.isError()).toBe(true)
  })

  test('deve falhar quando usuário está bloqueado', async () => {
    const bloqueadoAte = new Date(Date.now() + 10 * 60 * 1000)
    const repoBloqueado: ITentativaLoginRepositorio = {
      async buscarPorCpf() { return { cpf: '52998224725', tentativas: 5, bloqueadoAte } },
      async incrementar(cpf) { return { cpf, tentativas: 5, bloqueadoAte } },
      async bloquear() {},
      async resetar() {}
    }
    const usecaseBloqueado = new LoginUseCase(mockRegisterClient, repoBloqueado, jwtService, mockSessaoRepo)
    const resultado = await usecaseBloqueado.execute({
      cpf: '529.982.247-25',
      senha: 'minhasenha123'
    })
    expect(resultado.isError()).toBe(true)
  })

  test('deve retornar token com CPF e senha corretos', async () => {
    const resultado = await usecase.execute({
      cpf: '529.982.247-25',
      senha: 'minhasenha123'
    })
    expect(resultado.isSuccess()).toBe(true)
    expect(resultado.value).toHaveProperty('token')
  })
})