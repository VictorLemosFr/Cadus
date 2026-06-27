import { describe, test, expect, vi } from 'vitest'
import { LogoutUseCase } from '../../usecases/Logout'
import type { ISessaoRepositorio } from '../../infra/database/ISessaoRepositorio'

describe('LogoutUseCase', () => {
  test('deve invalidar a sessão com o token correto', async () => {
    const invalidarSpy = vi.fn()
    const mockSessaoRepo: ISessaoRepositorio = {
      async criar() {},
      async buscarPorToken() { return { ativo: true } },
      invalidar: invalidarSpy
    }

    const usecase = new LogoutUseCase(mockSessaoRepo)
    const resultado = await usecase.execute({ token: 'token-123' })

    expect(resultado.isSuccess()).toBe(true)
    expect(invalidarSpy).toHaveBeenCalledWith('token-123')
    expect(invalidarSpy).toHaveBeenCalledTimes(1)
  })
})
