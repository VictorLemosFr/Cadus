import type { Request, Response, NextFunction } from 'express'
import { JwtService } from '../../infra/auth/JwtService'
import { PrismaSessaoRepositorio } from '../../infra/database/PrismaSessaoRepositorio'
import type { ISessaoRepositorio } from '../../infra/database/ISessaoRepositorio'

export interface AuthenticatedRequest extends Request {
  cpf?: string
}

export function criarAuthMiddleware(jwtService: JwtService, sessaoRepo: ISessaoRepositorio) {
  return async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' })
    }

    const token = authHeader.replace('Bearer ', '')

    let payload
    try {
      payload = jwtService.verificar(token)
    } catch {
      return res.status(401).json({ erro: 'Token inválido ou expirado' })
    }

    const sessao = await sessaoRepo.buscarPorToken(token)

    if (!sessao || !sessao.ativo) {
      return res.status(401).json({ erro: 'Sessão inválida ou encerrada' })
    }

    if (sessao.expiresAt < new Date()) {
      await sessaoRepo.invalidar(token)
      return res.status(401).json({ erro: 'Sessão expirada por inatividade' })
    }

    const novoExpiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
    await sessaoRepo.renovar(token, novoExpiresAt)

    req.cpf = payload.cpf
    next()
  }
}

export const authMiddleware = criarAuthMiddleware(new JwtService(), new PrismaSessaoRepositorio())
