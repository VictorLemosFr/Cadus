import { describe, expect, test, vi, beforeEach } from "vitest";
import { RegisterIdentidadeController } from "../controllers/RegisterIdentidadeController";
import type { IRegisterIdentidadeUC } from "../../application/ports/IRegisterIdentidadeUC";
import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { IdentidadeDados } from "../../domain/entities/identidade/IdentidadeDados";
import { success, failure } from "../../shared/Either";
import type { Identidade } from "../../domain/entities/identidade/Identidade";

describe("RegisterIdentidadeController", () => {
  let controller: RegisterIdentidadeController;
  let mockRegisterIdentidade: ReturnType<typeof vi.fn>;

  const mockIdentidadeData: IdentidadeDados = {
    nome: "João Silva",
    cpf: "12345678901",
    dataNascimento: "1990-01-15",
    genero: "masculino",
    pronome: "ele",
    email: "joao@example.com",
    telefone: "11987654321",
    senha: "senha123",
    endereco: {
      cep: "01310-100",
      numero: 123,
    },
  };

  const mockIdentidade = {
    cpf: "12345678901",
    email: "joao@example.com",
    value: mockIdentidadeData,
  } as unknown as Identidade;

  beforeEach(() => {
    mockRegisterIdentidade = vi.fn();
    const mockUseCase: IRegisterIdentidadeUC = {
      registerIdentidade: mockRegisterIdentidade,
    };
    controller = new RegisterIdentidadeController(mockUseCase);
  });

  describe("CENÁRIOS DE SUCESSO", () => {
    test("Deve registrar identidade com dados válidos", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          pronome: "ele",
          email: "JOAO@EXAMPLE.COM",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(success(mockIdentidade));

      const response: HttpResponse = await controller.handle(request);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(mockIdentidade);
      expect(mockRegisterIdentidade).toHaveBeenCalledOnce();

      const callArgs = mockRegisterIdentidade.mock.calls[0][0];
      expect(callArgs.nome).toBe("João Silva");
      expect(callArgs.cpf).toBe("12345678901");
      expect(callArgs.email).toBe("joao@example.com");
      expect(callArgs.telefone).toBe("11987654321");
    });

    test("Deve ignorar campo pronome se não fornecido", async () => {
      const request: HttpRequest = {
        body: {
          nome: "Maria Silva",
          cpf: "987.654.321-00",
          dataNascimento: "1995-05-20",
          genero: "feminino",
          email: "maria@example.com",
          telefone: "(11) 91234-5678",
          senha: "senha456",
          endereco: { cep: "01310-100", numero: 456 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(success(mockIdentidade));

      const response: HttpResponse = await controller.handle(request);

      expect(response.statusCode).toBe(201);
      expect(mockRegisterIdentidade).toHaveBeenCalledOnce();
    });
  });

  describe("CENÁRIOS DE ERRO - Validação", () => {
    test("Deve retornar 400 quando body está faltando", async () => {
      const request: HttpRequest = {};
      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Corpo da requisição");
    });

    test("Deve retornar 400 quando body não é objeto", async () => {
      const request: HttpRequest = { body: "não é objeto" };
      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Corpo da requisição");
    });

    test("Deve retornar 400 quando campo obrigatório falta", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };
      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param: dataNascimento");
    });

    test("Deve retornar 400 quando múltiplos campos faltam", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          genero: "masculino",
          email: "joao@example.com",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };
      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param:");
    });

    test("Deve retornar 400 quando campo é string vazia", async () => {
      const request: HttpRequest = {
        body: {
          nome: "",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };
      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param: nome");
    });

    test("Deve retornar 400 quando campo é null", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: null,
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };
      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing param: cpf");
    });
  });

  describe("CENÁRIOS DE ERRO - Use Case", () => {
    test("Deve retornar 400 quando identidade já existe", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(
        failure(new Error("A identidade já existe."))
      );

      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("A identidade já existe");
    });

    test("Deve retornar 400 quando use case retorna erros de validação", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(
        failure([new Error("CPF inválido"), new Error("Email inválido")])
      );

      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Dados inválidos");
      expect(response.body).toContain("CPF inválido");
      expect(response.body).toContain("Email inválido");
    });
  });

  describe("CENÁRIOS DE ERRO - Exceções", () => {
    test("Deve retornar 500 quando ocorre erro inesperado no use case", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockRejectedValueOnce(
        new Error("Erro de conexão com banco")
      );

      const response: HttpResponse = await controller.handle(request);
      expect(response.statusCode).toBe(500);
      expect(response.body).toBeDefined();
    });
  });

  describe("CENÁRIOS LIMITE", () => {
    test("Deve normalizar dados com espaços em branco", async () => {
      const request: HttpRequest = {
        body: {
          nome: "  João Silva  ",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "  JOAO@EXAMPLE.COM  ",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(success(mockIdentidade));

      await controller.handle(request);

      const callArgs = mockRegisterIdentidade.mock.calls[0][0];
      expect(callArgs.nome).toBe("João Silva");
      expect(callArgs.email).toBe("joao@example.com");
    });

    test("Deve remover caracteres especiais do CPF", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(success(mockIdentidade));

      await controller.handle(request);

      const callArgs = mockRegisterIdentidade.mock.calls[0][0];
      expect(callArgs.cpf).toBe("12345678901");
    });

    test("Deve remover caracteres especiais do telefone", async () => {
      const request: HttpRequest = {
        body: {
          nome: "João Silva",
          cpf: "123.456.789-01",
          dataNascimento: "1990-01-15",
          genero: "masculino",
          email: "joao@example.com",
          telefone: "(11) 9-8765-4321",
          senha: "senha123",
          endereco: { cep: "01310-100", numero: 123 },
        },
      };

      mockRegisterIdentidade.mockResolvedValueOnce(success(mockIdentidade));

      await controller.handle(request);

      const callArgs = mockRegisterIdentidade.mock.calls[0][0];
      expect(callArgs.telefone).toBe("11987654321");
    });
  });
});