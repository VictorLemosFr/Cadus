import { describe, test, expect } from 'vitest'
import { Cpf } from '../Cpf'

describe('Cpf', () => {
  describe('create()', () => {
    test('deve aceitar um CPF válido formatado', () => {
      const resultado = Cpf.create('529.982.247-25')
      expect(resultado.isSuccess()).toBe(true)
    })

    test('deve rejeitar CPF vazio', () => {
      const resultado = Cpf.create('')
      expect(resultado.isError()).toBe(true)
    })

    test('deve rejeitar CPF com formato errado', () => {
      const resultado = Cpf.create('12345678900')
      expect(resultado.isError()).toBe(true)
    })

    test('deve rejeitar CPF com dígitos inválidos', () => {
      const resultado = Cpf.create('111.111.111-11')
      expect(resultado.isError()).toBe(true)
    })
  })
})
