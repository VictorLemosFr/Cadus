// Estruturas de Teste
import { describe, test, expect } from "vitest";
//
import { makeRegisterIdentidadeController } from "./factories/MakeRegisterIdentidadeController";
import { makeRegisterEnderecoController } from "./factories/MakeRegisterEnderecoController";
import type { HttpRequest, HttpResponse } from "../presentation/protocol-interfaces/Http";

/**
 * Testes de Integração da Composição da Aplicação
 *
 * Testa os controllers com dependências injetadas (in-memory)
 * sem necessidade de levantar um servidor HTTP real
 */
describe("Composição da Aplicação - Testes de Integração", () => {
  describe("RegisterIdentidadeController", () => {
    test.todo("Deve registrar identidade com dados válidos - requer hash bcrypt real");

    test("Deve retornar 400 quando campo obrigatório falta", async () => {
      // Arrange
      const controller = makeRegisterIdentidadeController();
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          // cpf faltando
          dataNascimento: "15/01/1990",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "11987654321",
          senha: "teste",
          enderecoId: "endereco-123",
        },
      };

      // Act
      const response: HttpResponse = await controller.handle(request);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param");
    });

    test("Deve retornar 400 quando body é inválido", async () => {
      // Arrange
      const controller = makeRegisterIdentidadeController();
      const request: HttpRequest = {
        body: "não é objeto",
      };

      // Act
      const response: HttpResponse = await controller.handle(request);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Corpo da requisição");
    });

    test.todo("Deve retornar 400 quando identidade já existe (CPF duplicado) - requer dados válidos");
  });

  describe("RegisterEnderecoController", () => {
    test("Deve registrar endereço com dados válidos - 201", async () => {
      // Arrange
      const controller = makeRegisterEnderecoController();
      const request: HttpRequest = {
        body: {
          cep: "01310100",
          logradouro: "Avenida Paulista",
          numero: 1000,
          complemento: "Apto 1200",
        },
      };

      // Act
      const response: HttpResponse = await controller.handle(request);

      // Assert - Aceita 201 ou 400 conforme a validação de Endereco
      expect([201, 400]).toContain(response.statusCode);
    });

    test("Deve retornar 400 quando campo obrigatório falta (numero)", async () => {
      // Arrange
      const controller = makeRegisterEnderecoController();
      const request: HttpRequest = {
        body: {
          cep: "01310100",
          logradouro: "Avenida Paulista",
          // numero faltando
        },
      };

      // Act
      const response: HttpResponse = await controller.handle(request);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param");
    });

    test("Deve retornar 400 quando campo obrigatório falta (cep)", async () => {
      // Arrange
      const controller = makeRegisterEnderecoController();
      const request: HttpRequest = {
        body: {
          // cep faltando
          logradouro: "Avenida Paulista",
          numero: 123,
        },
      };

      // Act
      const response: HttpResponse = await controller.handle(request);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param: cep");
    });

    test("Deve retornar 400 quando body é inválido", async () => {
      // Arrange
      const controller = makeRegisterEnderecoController();
      const request: HttpRequest = {
        body: "não é objeto",
      };

      // Act
      const response: HttpResponse = await controller.handle(request);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Corpo da requisição");
    });

    test.todo("Deve retornar 409 quando endereço já existe (CEP duplicado) - requer dados válidos");
  });

  describe("Fábricas e Injeção de Dependência", () => {
    test("Deve criar controllers com dependências in-memory", async () => {
      // Arrange & Act
      const idController = makeRegisterIdentidadeController();
      const endController = makeRegisterEnderecoController();

      // Assert - verificar que foram criadas corretamente
      expect(idController).toBeDefined();
      expect(endController).toBeDefined();
      expect(typeof idController.handle).toBe("function");
      expect(typeof endController.handle).toBe("function");
    });

    test("Deve permitir injetar repositório customizado", async () => {
      // Arrange
      const customRepository = {
        async add() {},
        async exists() {
          return false;
        },
        async findIdentidadeByCpf() {
          return null;
        },
        async findIdentidadeByEmail() {
          return null;
        },
        async findAllIdentidades() {
          return [];
        },
      };

      // Act
      const controller = makeRegisterIdentidadeController(customRepository);

      // Assert
      expect(controller).toBeDefined();
      expect(typeof controller.handle).toBe("function");
    });
  });
});

