import { describe, test, expect } from 'vitest'
import { Senha } from '../Senha'

describe('Senha', () => {
  describe('create()', () => {
    test('deve aceitar uma senha válida', () => {
      const resultado = Senha.create('minhasenha123')
      expect(resultado.isSuccess()).toBe(true)
    })

    test('deve rejeitar senha vazia', () => {
      const resultado = Senha.create('')
      expect(resultado.isError()).toBe(true)
    })

    test('deve rejeitar senha com menos de 8 caracteres', () => {
      const resultado = Senha.create('abc123')
      expect(resultado.isError()).toBe(true)
    })

    test('deve aceitar senha com exatamente 8 caracteres', () => {
      const resultado = Senha.create('abcd1234')
      expect(resultado.isSuccess()).toBe(true)
    })
  })
})
