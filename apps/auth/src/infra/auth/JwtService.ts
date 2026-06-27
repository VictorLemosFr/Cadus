import jwt from 'jsonwebtoken'
import 'dotenv/config'

export interface JwtPayload {
  cpf: string
}

export class JwtService {
  private readonly secret: string
  private readonly expiresIn = '8h'

  constructor() {
    this.secret = process.env.JWT_SECRET!
  }

  gerar(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
  }

  verificar(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload
  }
}
