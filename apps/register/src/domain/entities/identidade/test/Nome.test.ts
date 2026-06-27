import { describe, expect, test } from "vitest";
import { Nome } from "../Nome";

describe('NomeVO', () => {
    describe('CENÁRIOS DE SUCESSO', () => {
        test('deve aceitar nome simples válido', () => {
            const resultado = Nome.create('João Silva');
            expect(resultado.isSuccess()).toBe(true);
        });

        test('deve aceitar nome com exatamente 2 caracteres', () => {
            const resultado = Nome.create('Jo');
            expect(resultado.isSuccess()).toBe(true);
        });

        test('deve aceitar nome com exatamente 255 caracteres', () => {
            const resultado = Nome.create('a'.repeat(255));
            expect(resultado.isSuccess()).toBe(true);
        });
    });
    describe('CENÁRIOS DE ERRO', () => {
        test('deve falhar com nome vazio', () => {
            const resultado = Nome.create('');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com nome só de espaços', () => {
            const resultado = Nome.create('   ');
            expect(resultado.isError()).toBe(true);
        });
    });
    describe('CENÁRIOS DE LIMITE', () => {
        test('deve falhar com nome de 1 caractere', () => {
            const resultado = Nome.create('J');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com nome de 256 caracteres', () => {
            const resultado = Nome.create('a'.repeat(256));
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com nome só de espaços com 2 caracteres', () => {
            const resultado = Nome.create('  ');
            expect(resultado.isError()).toBe(true);
        });
    });
});