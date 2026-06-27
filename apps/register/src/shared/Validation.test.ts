import { describe, test, expect } from "vitest"; 
import { Validation } from "./Validation";
import { failure, success } from "./Either";

describe("Validation", () => {
    describe('combine()', () => {
        // --- CENÁRIOS DE SUCESSO ---
        describe("Cenários de Sucesso", () => {
    
            test("deve retornar um Either de sucesso contendo um objeto vazio quando o input for vazio", () => {
                const input = {};
                const resultado = Validation.combine(input);

                expect(resultado.isError()).toBe(false);
                expect(resultado.value).toEqual({});
            });

            test("deve combinar múltiplos Eithers de sucesso em um único objeto mapeado corretamente", () => {
                const input = {
                    nome: success<Error, string>("João"),
                    idade: success<Error, number>(25),
                    ativo: success<Error, boolean>(true),
                };

                const resultado = Validation.combine(input);
                
                expect(resultado.isError()).toBe(false);
                expect(resultado.value).toEqual({
                    nome: "João",
                    idade: 25,
                    ativo: true,
                });
            });     
    });

    // --- CENÁRIOS DE ERRO ---
    describe("Cenários de Erro", () => {
        test("deve retornar um Either de erro contendo um array com um único erro se apenas uma validação falhar", () => {
        const meuErro = new Error("Email inválido");
        const input = {
            nome: success<Error, string>("João"),
            email: failure(meuErro),
        };

        const resultado = Validation.combine(input);
        
        expect(resultado.isError()).toBe(true);
        expect(resultado.value).toBeInstanceOf(Array);
        expect(resultado.value).toHaveLength(1);
        expect(resultado.value[0]).toBe(meuErro);
        });

        test("deve acumular múltiplos erros no array se várias validações falharem ao mesmo tempo", () => {
            const erro1 = new Error("Nome muito curto");
            const erro2 = new Error("Idade mínima é 18 anos");
            
            const input = {
                nome: failure(erro1),
                idade: failure(erro2),
                ativo: success<Error, boolean>(true),
            };

            const resultado = Validation.combine(input);

            expect(resultado.isError()).toBe(true);
            expect(resultado.value).toBeInstanceOf(Array);
            expect(resultado.value).toHaveLength(2);
            expect(resultado.value).toEqual([erro1, erro2]);
        });
        
        test("deve priorizar o estado de erro mesmo que a maioria dos campos seja de sucesso", () => {
            const erroCritico = new Error("Token expirado");
            const input = {
                campo1: success<Error, string>("ok"),
                campo2: success<Error, number>(123),
                campo3: success<Error, boolean>(true),
                campoProblematico: failure(erroCritico),
            };

            const resultado = Validation.combine(input);

            expect(resultado.isError()).toBe(true);
            expect(resultado.value).toEqual([erroCritico]);
        });
    });

    // --- CENÁRIOS DE TIPOS DE VALORES E BORDA ---
    describe("Cenários de Tipos de Dados e Borda", () => {
        test("deve lidar corretamente com valores nulos ou falsy encapsulados no success", () => {
            const input = {
                vazio: success<Error, string>(""),
                zero: success<Error, number>(0),
                nulo: success<Error, unknown>(null),
                falso: success<Error, boolean>(false),
            };
            
            const resultado = Validation.combine(input);

            expect(resultado.isError()).toBe(false);
            expect(resultado.value).toEqual({
                vazio: "",
                zero: 0,
                nulo: null,
                falso: false,
            });
        });

        test("deve extrair objetos e arrays complexos de dentro do success sem perder a estrutura", () => {
            interface Data{ 
                tags: string[], 
                metadata: Record<string, number>
            }
            const dadosComplexos: Data = { tags: ["ts", "js"], metadata: { id: 1 } };
            const input = {
                dados: success<Error, Data>(dadosComplexos),
            };

            const resultado = Validation.combine(input);

            expect(resultado.isError()).toBe(false);
            expect(resultado.value.dados).toStrictEqual(dadosComplexos);
        });
        });
    }); 
});
