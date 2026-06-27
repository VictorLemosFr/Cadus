import { test, expect, describe, assert } from 'vitest';
import { Identidade } from '../Identidade';
import { IdentidadeId } from '../IdentidadeId';
import { EnderecoId } from '../../endereco/EnderecoId';
import type { IdentidadeProps } from '../IdentidadeProps';
import type { IdentidadeDados } from '../IdentidadeDados';

// Libraries
import { hash } from 'bcrypt';

// Errors
import { InvalidCpfError } from '../../../errors/InvalidCpf';
import { InvalidNomeError } from '../../../errors/InvalidNome';
import { InvalidTelefoneError } from '../../../errors/InvalidTelefone';
import { InvalidGeneroError } from '../../../errors/InvalidGenero';
import { InvalidSenhaError } from '../../../errors/InvalidSenha';
import { InvalidIdError } from '../../../errors/InvalidId';
import { InvalidEmailError } from '../../../errors/InvalidEmail';
import { InvalidPronomeError } from '../../../errors/InvalidPronome';
import { InvalidDataError } from '../../../errors/InvalidData';

// Criando testes para o modelo de entrada das Entiaddes de entrada do domínio de identidade.
// Funções
describe('IdentidadeEntity', () => {

    // Mock global  
    const identidadeId = IdentidadeId.generate();
    const saidaDadosTeste: IdentidadeDados =  {
        nome: "João Silva",
        cpf: "123.456.789-00",
        dataNascimento: expect.any(Date),
        genero: "MASCULINO",
        pronome: "Ele",
        email: "joao.silva@example.com",
        telefone: "11 99999-9999",
        enderecoId: "Rua Sigismundo Gonçalves",
        senha: expect.any(String),
        criadoEm: expect.any(Date),
        atualizadoEm: expect.any(Date)
    }

    // --- CENÁRIOS DE SUCESSO ---
    describe('Cenários de Sucesso', () => {

        // Mockups para as dependências das propriedades de IdentidadeProps
        const entradaDadosTeste1: IdentidadeDados = {
            nome: "João Silva",
            cpf: "123.456.789-00",
            dataNascimento: "10/10/2000",
            genero: "Masculino",
            pronome: "Ele",
            email: "joao.silva@example.com",
            telefone: "11 99999-9999",
            enderecoId: "Rua Sigismundo Gonçalves",
            senha: "minhasenha",
            criadoEm: new Date(),
            atualizadoEm: new Date()
        };

        test('deve retornar uma Identidade de sucesso', () => {
            const resultado = Identidade.create(entradaDadosTeste1, identidadeId);
            // expect(resultado.isSuccess()).toBe(true);
            if (resultado.isSuccess()) { 
                const valor = resultado.value;
                expect({
                    nome: valor.nome.value,
                    cpf: valor.cpf.valueFormatado,
                    email: valor.email.value,
                    dataNascimento: valor.dataNascimento.value,
                    genero: valor.genero.value,
                    pronome: valor.pronome?.value,
                    telefone: valor.telefone.value,
                    enderecoId: valor.endereco.value,
                    senha: valor.senha.value,
                    criadoEm: valor.criadoEm.value,
                    atualizadoEm: valor.atualizadoEm.value
                }).toEqual(saidaDadosTeste);
            }
        });
    });

    // --- CENÀRIOS DE ERRO ---
    describe('Cenários de Erro', () => {

        const entradaDadosTeste2: IdentidadeDados = {
            nome: "João Silva",
            cpf: "004.994.092-99",
            dataNascimento: "10/10/2000",
            genero: "Masculino",
            pronome: "Ele",
            email: "joao.silva@example.com",
            telefone: "11 -asd 99999-9999",
            enderecoId: EnderecoId.generate().value,
            senha: "minhasenha",
            criadoEm: new Date(),
            atualizadoEm: new Date()
        };

        describe ('Campos Ausentes.', () => {
            test('deve falhar com nome ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, nome: "" }, identidadeId);
                expect(resultado.isError()).toBe(true);
                if (resultado.isError()){
                     expect(resultado.value.some(e => e instanceof InvalidNomeError)).toBe(true);
                }
                
            });
            
            test('deve falhar com cpf ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, cpf: "" }, identidadeId);
                expect(resultado.isError()).toBe(true);
                if (resultado.isError()){
                     expect(resultado.value.some(e => e instanceof InvalidCpfError)).toBe(true);
                }
            });

            test('deve falahr com data de nascimento ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, dataNascimento: "" }, identidadeId); 
            });

            test('deve falhar com email ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, email: "" }, identidadeId);
                expect(resultado.isError()).toBe(true);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidEmailError)).toBe(true);
                }
            });

            test('deve falhar com telefone ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, telefone: "" }, identidadeId);
                if (resultado.isError()){
                     expect(resultado.value.some(e => e instanceof InvalidTelefoneError)).toBe(true);
                }
            });

            test('deve falhar com genero ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, genero: "" }, identidadeId);
                if (resultado.isError()){
                     expect(resultado.value.some(e => e instanceof InvalidGeneroError)).toBe(true);
                }
            });

            test('deve falhar com senha ausente',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, senha: "" }, identidadeId);
                if (resultado.isError()){
                     expect(resultado.value.some(e => e instanceof InvalidSenhaError)).toBe(true);
                }
            });

        });

        describe('Formatos Inválidos.', () => {
            test('deve falhar com cpf inválido',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, cpf: "123" }, identidadeId);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidCpfError)).toBe(true);
                }
            });

            test('deve falhar com email inválido',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, email: "joaoexample.com" }, identidadeId);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidEmailError)).toBe(true);
                }
            });

            test('deve falhar com telefone inválido',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, telefone: "123" }, identidadeId);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidTelefoneError)).toBe(true);
                }
            });

            test('deve falhar com genero inválido',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, genero: "X" }, identidadeId);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidGeneroError)).toBe(true);
                }
            });

            test('deve falhar com pronome inválido',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, pronome: "X" }, identidadeId);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidPronomeError)).toBe(true);
                }
            });

            test('deve falhar com dataNascimento inválida',  () => {
                const resultado =  Identidade.create({ ...entradaDadosTeste2, dataNascimento: "00/10/20" }, identidadeId);
                if (resultado.isError()){
                    expect(resultado.value.some(e => e instanceof InvalidDataError)).toBe(true);
                }
            });
        });
        
    });


    // --- CENÁRIOS DE TIPOS DE VALORES E Limite ---
    describe('Cenários de Tipo de Valores e Limite', () => {
        test('', () => {});
    });

});