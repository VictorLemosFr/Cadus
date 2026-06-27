import type { UsuarioRegister } from './RegisterClient'

export interface IRegisterClient {
  buscarUsuarioPorCpf(cpf: string): Promise<UsuarioRegister | null>
}
