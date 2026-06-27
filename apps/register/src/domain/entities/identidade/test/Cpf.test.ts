import { describe, expect, test } from "vitest";
import { Cpf } from "../Cpf";

describe("CpfVO", () => {

    describe('Validação', () => {

        const cpfExamplo: string = "11 99990-9999";
        // Para valida um cpf, ele tem que ter 11 dígitos    
        describe('CENÁRIOS DE SUCESSO', () => {
            test('deve retornar um assert quando a entrada possuir 11 dígitos numéricos.', () => {
                const resultado = Cpf.create(cpfExamplo);
                const valor = resultado.value;
                if (resultado.isError()) return;
                const numDigitos: number = resultado.value.value.length;
                expect(numDigitos).equals(11);
            });
        })
    
        describe('CENÁRIOS DE ERRO', () => {
            test('deve retornar um false para um cpf que não existe', () => {
                const resultado = Cpf.existsCpfValitaion("123.456.789-10");
                expect(resultado).toBe(false)
            });
            test('deve retornar um true para uma falta de campo de cpf', () => {
                const resultado = Cpf.noFieldExistsValidation("");
                expect(resultado).toBe(true);
            });
            test('deve retornar um false no caso de um formato inválido do cpf', () => {
                const resultado = Cpf.isFormatCpfError("$123.456.789-10");
                expect(resultado).toBe(false);
            });
        })
    
        describe('CENÁRIOS DE LIMITE', () => {
            test('deve retornar um falso quando entram letras no lugar de números', () => {
                
            });
        });
    })
});