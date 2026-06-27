import { describe, test, expect, beforeEach } from "vitest";

import { RegisterIdentidade } from "./RegisterIdentidade";
import { RegisterEndereco } from "../registrar-endereco/RegisterEndereco";
import { InMemoryIdentidadeRepo } from "../../ports/respositories/in-memory-tests/InMemoryIdentidadeRepo";
import { InMemoryEnderecoRepository } from "../../ports/respositories/in-memory-tests/InMemoryEnderecoRepository";
import { FakeHashProvider } from "../../helpers/FakeHashProvider";

import type { IdentidadeDados } from "../../../domain/entities/identidade/IdentidadeDados";

function makeIdentidadeDados(override: Partial<IdentidadeDados> = {}): IdentidadeDados {
    return {
        nome: "Joao",
        cpf: "600.912.320-82",
        dataNascimento: "10/10/2000",
        genero: "Masculino",
        pronome: "ELE_DELE",
        email: "joao.silva@example.com",
        telefone: "11 99999-9999",
        senha: "MinhaSenha123",
        endereco: {
            cep: "50670-901",
            logradouro: "Rua Sigismundo Gonçalves",
            numero: 100,
            complemento: "Apto 101",
        },
        ...override,
    };
}

describe("RegisterIdentidade", () => {
    let identidadeRepo: InMemoryIdentidadeRepo;
    let enderecoRepo: InMemoryEnderecoRepository;
    let registerEndereco: RegisterEndereco;
    let registerIdentidade: RegisterIdentidade;
    let hashProvider: FakeHashProvider;

    beforeEach(() => {
        identidadeRepo = new InMemoryIdentidadeRepo([]);
        enderecoRepo = new InMemoryEnderecoRepository([]);
        registerEndereco = new RegisterEndereco(enderecoRepo);
        hashProvider = new FakeHashProvider();
        registerIdentidade = new RegisterIdentidade(
            identidadeRepo,
            hashProvider,
            registerEndereco,
            enderecoRepo
        );
    });

    describe("CENARIOS DE SUCESSO", () => {
        test("deve registrar uma nova identidade criando um novo endereco", async () => {
            const dados = makeIdentidadeDados();

            const resultado = await registerIdentidade.registerIdentidade(dados);

            expect(resultado.isSuccess()).toBe(true);
            if (resultado.isSuccess()) {
                expect(resultado.value.cpf.value).toBe("60091232082");
            }

            const enderecosCadastrados = await enderecoRepo.findAllEnderecos();
            expect(enderecosCadastrados).toHaveLength(1);
            expect(enderecosCadastrados[0]?.cep.value).toBe("50670-901");
        });

        test("deve reaproveitar um endereco ja existente (mesmo CEP) em vez de duplicar", async () => {
            const primeiraIdentidade = makeIdentidadeDados({
                cpf: "706.300.900-17",
                email: "primeira@example.com",
            });
            const segundaIdentidade = makeIdentidadeDados({
                cpf: "159.079.700-06",
                email: "segunda@example.com",
                endereco: { cep: "50670-901", numero: 200 },
            });

            const resultado1 = await registerIdentidade.registerIdentidade(primeiraIdentidade);
            const resultado2 = await registerIdentidade.registerIdentidade(segundaIdentidade);

            expect(resultado1.isSuccess()).toBe(true);
            expect(resultado2.isSuccess()).toBe(true);

            const enderecosCadastrados = await enderecoRepo.findAllEnderecos();
            expect(enderecosCadastrados).toHaveLength(1);

            if (resultado1.isSuccess() && resultado2.isSuccess()) {
                expect(resultado1.value.endereco.value).toBe(resultado2.value.endereco.value);
            }
        });

        test("deve persistir a senha com hash, nunca em texto puro", async () => {
            const dados = makeIdentidadeDados({ senha: "MinhaSenha123" });

            const resultado = await registerIdentidade.registerIdentidade(dados);

            expect(resultado.isSuccess()).toBe(true);
            if (resultado.isSuccess()) {
                expect(resultado.value.senha.value).not.toBe("MinhaSenha123");
                expect(resultado.value.senha.value).toHaveLength(60);
            }
        });
    });

    describe("CENARIOS DE FALHA", () => {
        test("nao deve registrar identidade com CPF ja existente", async () => {
            const dados = makeIdentidadeDados();
            await registerIdentidade.registerIdentidade(dados);

            const tentativaDuplicada = makeIdentidadeDados({
                email: "outro-email@example.com",
                endereco: { cep: "01310-930", numero: 50 },
            });
            const resultado = await registerIdentidade.registerIdentidade(tentativaDuplicada);

            expect(resultado.isError()).toBe(true);

            const todas = await identidadeRepo.findAllIdentidades();
            expect(todas).toHaveLength(1);
        });

        test("deve propagar erro de validacao quando os dados do endereco sao invalidos", async () => {
            const dados = makeIdentidadeDados({
                endereco: { cep: "", numero: -1 },
            });

            const resultado = await registerIdentidade.registerIdentidade(dados);

            expect(resultado.isError()).toBe(true);

            const todas = await identidadeRepo.findAllIdentidades();
            expect(todas).toBeNull();
        });

        test("deve propagar erro de validacao quando os dados da identidade sao invalidos", async () => {
            const dados = makeIdentidadeDados({ cpf: "cpf-invalido" });

            const resultado = await registerIdentidade.registerIdentidade(dados);

            expect(resultado.isError()).toBe(true);
        });
    });

    describe("CENARIOS LIMITE", () => {
        test("duas identidades com CEPs diferentes geram dois enderecos distintos", async () => {
            const identidadeA = makeIdentidadeDados({
                cpf: "706.300.900-17",
                email: "a@example.com",
                endereco: { cep: "50670-901", numero: 100 },
            });
            const identidadeB = makeIdentidadeDados({
                cpf: "159.079.700-06",
                email: "b@example.com",
                endereco: { cep: "01310-930", numero: 200 },
            });

            await registerIdentidade.registerIdentidade(identidadeA);
            await registerIdentidade.registerIdentidade(identidadeB);

            const enderecosCadastrados = await enderecoRepo.findAllEnderecos();
            expect(enderecosCadastrados).toHaveLength(2);
        });
    });
});