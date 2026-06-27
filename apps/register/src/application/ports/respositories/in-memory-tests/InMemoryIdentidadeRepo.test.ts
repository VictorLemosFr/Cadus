import { describe, test, expect, beforeEach } from "vitest";

import { InMemoryIdentidadeRepo } from "./InMemoryIdentidadeRepo";
import { Identidade } from "../../../../domain/entities/identidade/Identidade";
import type { IdentidadeProps } from "../../../../domain/entities/identidade/IdentidadeProps";

import { ClassBuilder } from "../../../../shared/ClassBuilder";
import { CryptoIdGenerator } from "../../../../infra/providers/CryptoIdGenerator";
import { type Either, success, failure } from "../../../../shared/Either";


const identidadeBuilder = new ClassBuilder( (dados, id = new CryptoIdGenerator().generate()) =>
        Identidade.create(dados, id),
    {
        nome: "Joao",
        cpf: "600.912.320-82",
        dataNascimento: "10/10/2000",
        genero: "Masculino",
        pronome: "ELE_DELE",
        email: "joao.silva@example.com",
        telefone: "11 99999-9999",
        enderecoId: "Rua Sigismundo Gonçalves",
        senha: "MinhaSenha123",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
    });


describe("InMemoryIdentidadeRepository", () => {
    let repo: InMemoryIdentidadeRepo;

    beforeEach(() => {
        repo = new InMemoryIdentidadeRepo([]);
    });

    describe("CENARIOS DE SUCESSO", () => {
        test("deve adicionar uma nova identidade ao repositório", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props = identidade.value;
            await repo.add(props);

            const encontrada: IdentidadeProps | null = await repo.findIdentidadeByCpf(props.cpf);
            expect(encontrada).not.toBeNull();
            expect(encontrada).toEqual(identidade.value);
        });

        test("deve encontrar identidade existente por CPF", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            await repo.add(props);

            const resultado : IdentidadeProps | null = await repo.findIdentidadeByCpf(props.cpf);

            expect(resultado).not.toBeNull();
            expect(resultado?.cpf).toBe(props.cpf);
        });

        test("deve encontrar identidade existente por email", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            await repo.add(props);

            const resultado = await repo.findIdentidadeByEmail(props.email);

            expect(resultado).not.toBeNull();
            expect(resultado?.email).toBe(props.email);
        });

        test("deve retornar true em exists quando o CPF já está cadastrado", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            await repo.add(props);

            const resultado = await repo.exists(props.cpf);

            expect(resultado).toBe(true);
        });

        test("deve retornar todas as identidades cadastradas", async () => {
            const identidadeA = identidadeBuilder.extractProps<IdentidadeProps>({cpf: "706.300.900-17"});
            const identidadeB = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidadeA.isError()) {
                return failure(identidadeA.value);
            }
            if (identidadeB.isError()) {
                return failure(identidadeB.value);
            }
            const propsA : IdentidadeProps = identidadeA.value;
            const propsB : IdentidadeProps = identidadeB.value;
            await repo.add(propsA);
            await repo.add(propsB);

            const todas = await repo.findAllIdentidades();

            expect(todas).not.toBeNull();
            expect(todas).toHaveLength(2);
        });

        test("deve aceitar identidades pré-existentes via constructor", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            const repoComSeed = new InMemoryIdentidadeRepo([props]);

            const resultado = await repoComSeed.findIdentidadeByCpf(props.cpf);

            expect(resultado).not.toBeNull();
        });
    });

    describe("CENARIOS DE FALHA", () => {
        test("não deve adicionar identidade com CPF já existente", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            const duplicata = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            if (duplicata.isError()) {
                return failure(duplicata.value);
            }
            const props : IdentidadeProps = identidade.value;
            const propsDuplicata: IdentidadeProps = duplicata.value;

            await repo.add(props);
            await repo.add(propsDuplicata);

            const todas = await repo.findAllIdentidades();

            expect(todas).toHaveLength(1); // duplicata foi ignorada
        });

        test("deve retornar null ao buscar por CPF inexistente", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>({cpf: "329.737.800-04" });
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            await repo.add(props);

            const outraIdentidade = identidadeBuilder.extractProps<IdentidadeProps>({cpf: "467.565.070-87"});
            if (outraIdentidade.isError()) {
                return failure(outraIdentidade.value);
            }
            const propsToCpfSearch : IdentidadeProps = outraIdentidade.value;

            const resultado = await repo.findIdentidadeByCpf(propsToCpfSearch.cpf);

            expect(resultado).toBeNull();
        });

        test("deve retornar null ao buscar por email inexistente", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>({email: "edukof@gmail.com"});
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            await repo.add(props);

            const outraIdentidade = identidadeBuilder.extractProps<IdentidadeProps>({email: "afreim@gmail.com"});
            if (outraIdentidade.isError()) {
                return failure(outraIdentidade.value);
            }
            const propsToEmailSearch : IdentidadeProps = outraIdentidade.value;
 
            const resultado = await repo.findIdentidadeByEmail(propsToEmailSearch.email);

            expect(resultado).toBeNull();
        });

        test("deve retornar false em exists quando o CPF não está cadastrado", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;

            const resultado = await repo.exists(props.cpf);

            expect(resultado).toBe(false);
        });

        test("deve retornar null em findAllIdentidades quando o repositório está vazio", async () => {
            const resultado = await repo.findAllIdentidades();

            expect(resultado).toBeNull();
        });
    });

    describe("CENARIOS LIMITE", () => {
        test("deve retornar lista com um único item quando há somente uma identidade", async () => {
            const identidade = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidade.isError()) {
                return failure(identidade.value);
            }
            const props : IdentidadeProps = identidade.value;
            await repo.add(props);

            const todas = await repo.findAllIdentidades();

            expect(todas).not.toBeNull();
            expect(todas).toHaveLength(1);
        });

        test("add de identidade duplicada não deve alterar a identidade já existente", async () => {
            const original = identidadeBuilder.extractProps<IdentidadeProps>();
            const tentativaDuplicada = identidadeBuilder.extractProps<IdentidadeProps>();
            if (original.isError()) {
                return failure(original.value);
            }
            if (tentativaDuplicada.isError()) {
                return failure(tentativaDuplicada.value);
            }
            const propsOriginal : IdentidadeProps = original.value;
            const propsTDuplicata : IdentidadeProps = tentativaDuplicada.value;
            await repo.add(propsOriginal);
            await repo.add(propsTDuplicata);

            const resultado = await repo.findIdentidadeByCpf(propsOriginal.cpf);

            expect(resultado?.nome).toEqual(propsOriginal.nome);
        });

        test("cada instância do repositório deve manter estado isolado", async () => {
            const identidadeA = identidadeBuilder.extractProps<IdentidadeProps>();
            if (identidadeA.isError()) {
                return failure(identidadeA.value);
            }
            const propsA : IdentidadeProps = identidadeA.value;
            const repoA = new InMemoryIdentidadeRepo([]);
            const repoB = new InMemoryIdentidadeRepo([]);

            await repoA.add(propsA);

            const resultadoEmA = await repoA.findIdentidadeByCpf(propsA.cpf);
            const resultadoEmB = await repoB.findIdentidadeByCpf(propsA.cpf);

            expect(resultadoEmA).not.toBeNull();
            expect(resultadoEmB).toBeNull();
        });

        test("deve encontrar corretamente quando há múltiplas identidades com CPFs distintos", async () => {
            const identidadeA = identidadeBuilder.extractProps<IdentidadeProps>({cpf: "706.300.900-17"});
            const identidadeB = identidadeBuilder.extractProps<IdentidadeProps>({cpf: "159.079.700-06"});
            const identidadeC = identidadeBuilder.extractProps<IdentidadeProps>({cpf: "364.920.290-54"});

            if (identidadeA.isError()) {
                return failure(identidadeA.value);
            }
            if (identidadeB.isError()) {
                return failure(identidadeB.value);
            }
            if (identidadeC.isError()) {
                return failure(identidadeC.value);
            }
            const propsA : IdentidadeProps = identidadeA.value;
            const propsB : IdentidadeProps = identidadeB.value;
            const propsC : IdentidadeProps = identidadeC.value;

            await repo.add(propsA);
            await repo.add(propsB);
            await repo.add(propsC);

            const resultado = await repo.findIdentidadeByCpf(propsB.cpf);

            expect(resultado?.email).toBe(propsB.email);
        });

        test("não deve encontrar por email quando apenas o CPF coincide com outro registro", async () => {
            const identidadeA = identidadeBuilder.extractProps<IdentidadeProps>({email: "jose@gmail.com"});
            const identidadeB = identidadeBuilder.extractProps<IdentidadeProps>({email: "claudio@gmali.com"});
            if (identidadeA.isError()) {
                return failure(identidadeA.value);
            }
            if (identidadeB.isError()) {
                return failure(identidadeB.value);
            }
            const propsB: IdentidadeProps = identidadeB.value;
            const propsA : IdentidadeProps = identidadeA.value;
            await repo.add(propsA);

            const resultado = await repo.findIdentidadeByEmail(propsB.email);

            expect(resultado).toBeNull();
        });
    });
});