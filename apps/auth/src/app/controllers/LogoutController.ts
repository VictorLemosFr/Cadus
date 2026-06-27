import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/authMiddleware'
import { LogoutUseCase } from '../../usecases/Logout'
import { PrismaSessaoRepositorio } from '../../infra/database/PrismaSessaoRepositorio'

const sessaoRepo = new PrismaSessaoRepositorio()
const logoutUseCase = new LogoutUseCase(sessaoRepo)

export async function logoutController(req: AuthenticatedRequest, res: Response) {
  const authHeader = req.headers.authorization!
  const token = authHeader.replace('Bearer ', '')

  await logoutUseCase.execute({ token })

  return res.status(200).json({ mensagem: 'Logout realizado com sucesso' })
}
