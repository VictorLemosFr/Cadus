import { prisma } from '../adapters/db'
import type { ITentativaLoginRepositorio, TentativaLoginDados } from './ITentativaLoginRepositorio'

export class PrismaTentativaLoginRepositorio implements ITentativaLoginRepositorio {
  async buscarPorCpf(cpf: string): Promise<TentativaLoginDados | null> {
    const registro = await prisma.tentativaLogin.findUnique({ where: { cpf } })
    if (!registro) return null
    return {
      cpf: registro.cpf,
      tentativas: registro.tentativas,
      bloqueadoAte: registro.bloqueadoAte
    }
  }

  async incrementar(cpf: string): Promise<TentativaLoginDados> {
    const registro = await prisma.tentativaLogin.upsert({
      where: { cpf },
      create: { cpf, tentativas: 1 },
      update: { tentativas: { increment: 1 } }
    })
    return {
      cpf: registro.cpf,
      tentativas: registro.tentativas,
      bloqueadoAte: registro.bloqueadoAte
    }
  }

  async bloquear(cpf: string): Promise<void> {
    const bloqueadoAte = new Date(Date.now() + 10 * 60 * 1000)
    await prisma.tentativaLogin.update({
      where: { cpf },
      data: { bloqueadoAte }
    })
  }

  async resetar(cpf: string): Promise<void> {
    await prisma.tentativaLogin.upsert({
      where: { cpf },
      create: { cpf, tentativas: 0 },
      update: { tentativas: 0, bloqueadoAte: null }
    })
  }
}
