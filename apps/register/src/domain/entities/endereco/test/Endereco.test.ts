// Estruturas de Teste
import { describe, expect, test } from "vitest";
// Entidades e Value Objects
import type { EnderecoDados } from "../EnderecoDados";
import { Endereco } from "../Endereco";
import { EnderecoId } from "../EnderecoId";
import { Logradouro } from "../Logradouro";


// Mockup básico de teste
const makeId = () => EnderecoId.generate();
const dadosValidos = {
  cep: '60110-001',
  logradouro: 'Rua dos Bobos',
  numero:  42,
  complemento: undefined,
};

describe('Entidade - Endereco', () => {

  describe('CENÁRIOS DE SUCESSO', () => {

    test('cria um endereço com dados válidos', () => {
      const resultado = Endereco.create(dadosValidos, makeId());

      expect(resultado.isError()).toBe(false);
    });

    test('expõe os getters corretamente', () => {
        const enderecoId = makeId();
        const endereco = Endereco.create(dadosValidos, enderecoId);

        if (endereco.isSuccess()) {
            const { id, cep, logradouro, numero } = endereco.value;
            expect(id).toBe(enderecoId);
            expect(cep.value).toBe(dadosValidos.cep);
            expect(logradouro.value).toBe(dadosValidos.logradouro);
            expect(numero.value).toBe(Number(dadosValidos.numero));
        }
    });

    test('cria um endereço sem complemento', () => {
      const resultado = Endereco.create({ ...dadosValidos, complemento: undefined }, makeId());

      expect(resultado.isError()).toBe(false);

      if (resultado.isSuccess()){
        const { complemento } = resultado.value;
        expect(complemento.value).toBeUndefined();
      }
    });

    test('cria um endereço com complemento', () => {
        const resultado = Endereco.create({ ...dadosValidos, complemento: 'Apto 12' }, makeId());

        expect(resultado.isError()).toBe(false);
        if (resultado.isSuccess()){
          const { complemento } = resultado.value;
            expect(complemento.value).toBe('Apto 12');
        }
    });

    test('duas instâncias com os mesmos dados são independentes', () => {
        const a = Endereco.create(dadosValidos, makeId());
        const b = Endereco.create(dadosValidos, makeId());

        if (a.isSuccess() && b.isSuccess()){
            expect(a.value.id.equals(b.value.id)).toBe(false);
        }
    });

  });

  describe('CENÁRIOS DE ERRO', () => {

      describe('falha — cep', () => {
    
        test('rejeita cep vazio', () => {
          const resultado = Endereco.create({ ...dadosValidos, cep: '' }, makeId());
    
          expect(resultado.isError()).toBe(true);
        });
    
        test('rejeita cep com formato inválido', () => {
          const resultado = Endereco.create({ ...dadosValidos, cep: '1234' }, makeId());
    
          expect(resultado.isError()).toBe(true);
        });
    
      });
    
      describe('falha — logradouro', () => {
    
        test('rejeita logradouro vazio', () => {
          const resultado = Endereco.create({ ...dadosValidos, logradouro: '' }, makeId());
    
          expect(resultado.isError()).toBe(true);
        });
    
      });
    
      describe('falha — numero', () => {
    
        test('rejeita numero negativo', () => {
          const resultado = Endereco.create({ ...dadosValidos, numero: -1 }, makeId());
    
          expect(resultado.isError()).toBe(true);
        });
    
      });
    
      describe('acumulação de erros', () => {
    
        test('retorna múltiplos erros quando há mais de um campo inválido', () => {
          const resultado = Endereco.create({
            cep: '',
            logradouro: '',
            numero: -19,
            complemento: undefined,
          }, makeId());
    
          expect(resultado.isError()).toBe(true);
          expect((resultado.value as Error[]).length).toBeGreaterThan(1);
        });
    
      });
    
    });
  });

describe('Endereco.reconstitute()', () => {

  test('reconstitui um endereço sem revalidar', () => {
    const id = makeId();
    const original = Endereco.create(dadosValidos, id);

    if (original.isSuccess()) {
        const { cep, logradouro, numero, complemento, criadoEm, atualizadoEm } = original.value;
        const reconstituido = Endereco.reconstitute(
            {
                cep: cep,
                logradouro: logradouro,
                numero: numero,
                complemento: complemento,
            },
            id,
            criadoEm,
            atualizadoEm,
        );
    
        expect(reconstituido.id.equals(id)).toBe(true);
        expect(reconstituido.cep.value).toBe(dadosValidos.cep);

    }
  });

});