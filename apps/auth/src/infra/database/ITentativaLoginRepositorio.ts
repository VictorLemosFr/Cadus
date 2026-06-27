export interface TentativaLoginDados {
  cpf: string
  tentativas: number
  bloqueadoAte: Date | null
}

export interface ITentativaLoginRepositorio {
  buscarPorCpf(cpf: string): Promise<TentativaLoginDados | null>
  incrementar(cpf: string): Promise<TentativaLoginDados>
  bloquear(cpf: string): Promise<void>
  resetar(cpf: string): Promise<void>
}
