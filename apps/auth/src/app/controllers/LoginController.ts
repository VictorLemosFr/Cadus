import type { Request, Response } from 'express'
import { LoginUseCase } from '../../usecases/Login'
import { RegisterClient } from '../../infra/http/RegisterClient'
import { JwtService } from '../../infra/auth/JwtService'
import { PrismaTentativaLoginRepositorio } from '../../infra/database/PrismaTentativaLoginRepositorio'
import { PrismaSessaoRepositorio } from '../../infra/database/PrismaSessaoRepositorio'

const registerClient = new RegisterClient()
const jwtService = new JwtService()
const tentativaRepo = new PrismaTentativaLoginRepositorio()
const sessaoRepo = new PrismaSessaoRepositorio()

const loginUseCase = new LoginUseCase(registerClient, tentativaRepo, jwtService, sessaoRepo)

export async function loginController(req: Request, res: Response) {
  const { cpf, senha } = req.body

  if (!cpf || !senha) {
    return res.status(400).json({ erro: 'CPF e senha são obrigatórios' })
  }

  const resultado = await loginUseCase.execute({ cpf, senha })

  if (resultado.isError()) {
    return res.status(401).json({ erro: resultado.value.message })
  }

  return res.status(200).json({ token: resultado.value.token })
}