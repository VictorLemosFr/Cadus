import { describe, expect, test } from "vitest";
import { Email } from "../Email";

describe('EmailVO', () => {
        describe('CENÁRIOS DE SUCESSO', () => {

        test('deve aceitar email simples válido', () => {
            const resultado = Email.create('joao@example.com');
            expect(resultado.isSuccess()).toBe(true);
        });

        test('deve aceitar email com subdomínio', () => {
            const resultado = Email.create('joao@mail.example.com');
            expect(resultado.isSuccess()).toBe(true);
        });

        test('deve aceitar email com caracteres especiais na conta', () => {
            const resultado = Email.create('joao.silva+tag@example.com');
            expect(resultado.isSuccess()).toBe(true);
        });

    });

    describe('CAMPOS AUSENTES', () => {

        test('deve falhar com email vazio', () => {
            const resultado = Email.create('');
            expect(resultado.isError()).toBe(true);
        });

    });

    describe('FORMATO INVÁLIDO', () => {

        test('deve falhar sem @', () => {
            const resultado = Email.create('joaoexample.com');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar sem domínio após @', () => {
            const resultado = Email.create('joao@');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar sem conta antes do @', () => {
            const resultado = Email.create('@example.com');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar sem extensão de domínio', () => {
            const resultado = Email.create('joao@example');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com dois @', () => {
            const resultado = Email.create('joao@@example.com');
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com espaço no email', () => {
            const resultado = Email.create('joao silva@example.com');
            expect(resultado.isError()).toBe(true);
        });

    });

    describe('CASOS LIMITE', () => {

        test('deve falhar com email acima de 256 caracteres', () => {
            const conta = 'a'.repeat(246);
            const resultado = Email.create(`${conta}@example.com`);
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com conta acima de 64 caracteres', () => {
            const conta = 'a'.repeat(65);
            const resultado = Email.create(`${conta}@example.com`);
            expect(resultado.isError()).toBe(true);
        });

        test('deve falhar com parte do domínio acima de 63 caracteres', () => {
            const dominio = 'a'.repeat(64);
            const resultado = Email.create(`joao@${dominio}.com`);
            expect(resultado.isError()).toBe(true);
        });

        test('deve aceitar email com conta de exatamente 64 caracteres', () => {
            const conta = 'a'.repeat(64);
            const resultado = Email.create(`${conta}@example.com`);
            expect(resultado.isSuccess()).toBe(true);
        });

    });

});