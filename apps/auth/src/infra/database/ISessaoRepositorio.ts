export interface ISessaoRepositorio {
  criar(cpf: string, token: string, expiresAt: Date): Promise<void>
  buscarPorToken(token: string): Promise<{ ativo: boolean; expiresAt: Date } | null>
  invalidar(token: string): Promise<void>
  renovar(token: string, novoExpiresAt: Date): Promise<void>
}