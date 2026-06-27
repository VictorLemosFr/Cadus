import { describe, test, expect, vi } from 'vitest'
import { criarAuthMiddleware } from '../../app/middlewares/authMiddleware'
import { JwtService } from '../../infra/auth/JwtService'
import type { ISessaoRepositorio } from '../../infra/database/ISessaoRepositorio'

const jwtService = new JwtService()
const tokenValido = jwtService.gerar({ cpf: '52998224725' })

function criarMockReqRes(authHeader?: string) {
  const req: any = { headers: { authorization: authHeader } }
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
  const next = vi.fn()
  return { req, res, next }
}

describe('authMiddleware', () => {
  test('deve bloquear quando não há token', async () => {
    const sessaoRepo: ISessaoRepositorio = {
      async criar() {}, async buscarPorToken() { return null }, async invalidar() {}, async renovar() {}
    }
    const middleware = criarAuthMiddleware(jwtService, sessaoRepo)
    const { req, res, next } = criarMockReqRes(undefined)

    await middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('deve bloquear quando a sessão não existe', async () => {
    const sessaoRepo: ISessaoRepositorio = {
      async criar() {}, async buscarPorToken() { return null }, async invalidar() {}, async renovar() {}
    }
    const middleware = criarAuthMiddleware(jwtService, sessaoRepo)
    const { req, res, next } = criarMockReqRes(`Bearer ${tokenValido}`)

    await middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('deve bloquear quando a sessão expirou por inatividade', async () => {
    const expirada = new Date(Date.now() - 1000)
    const invalidarSpy = vi.fn()
    const sessaoRepo: ISessaoRepositorio = {
      async criar() {},
      async buscarPorToken() { return { ativo: true, expiresAt: expirada } },
      invalidar: invalidarSpy,
      async renovar() {}
    }
    const middleware = criarAuthMiddleware(jwtService, sessaoRepo)
    const { req, res, next } = criarMockReqRes(`Bearer ${tokenValido}`)

    await middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(invalidarSpy).toHaveBeenCalledWith(tokenValido)
    expect(next).not.toHaveBeenCalled()
  })

  test('deve renovar a sessão e chamar next quando tudo está válido', async () => {
    const futura = new Date(Date.now() + 60 * 1000)
    const renovarSpy = vi.fn()
    const sessaoRepo: ISessaoRepositorio = {
      async criar() {},
      async buscarPorToken() { return { ativo: true, expiresAt: futura } },
      async invalidar() {},
      renovar: renovarSpy
    }
    const middleware = criarAuthMiddleware(jwtService, sessaoRepo)
    const { req, res, next } = criarMockReqRes(`Bearer ${tokenValido}`)

    await middleware(req, res, next)

    expect(renovarSpy).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(req.cpf).toBe('52998224725')
  })
})
