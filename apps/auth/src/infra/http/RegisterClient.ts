import 'dotenv/config'

export interface UsuarioRegister {
  cpf: string
  senhaHash: string
  email: string
}

export class RegisterClient {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.REGISTER_SERVICE_URL!
  }

  async buscarUsuarioPorCpf(cpf: string): Promise<UsuarioRegister | null> {
    const response = await fetch(`${this.baseUrl}/usuarios/${cpf}`)

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar usuário no register: ${response.status}`)
    }

    return response.json()
  }
}
