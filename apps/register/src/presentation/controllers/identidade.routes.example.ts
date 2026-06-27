/**
 * Exemplo de Integração: Rotas de Identidade
 * 
 * Demonstra como usar RegisterIdentidadeController em uma aplicação real
 * com Express ou framework similar
 */

import express, { type Router, type Request, type Response } from "express";
import { RegisterIdentidadeController } from "./RegisterIdentidadeController";
import { RegisterIdentidade } from "../../application/usecases/registrar-identidade/RegisterIdentidade";
import type { IIdentidadeRepository } from "../../application/ports/respositories/IIdentidadeRepository";
import type { HttpRequest } from "../protocol-interfaces/Http";

/**
 * Factory que cria um router com as rotas de identidade
 * 
 * @param identidadeRepository - Repositório de identidade
 * @returns Router Express configurado
 */
export function createIdentidadeRouter(
  identidadeRepository: IIdentidadeRepository
): Router {
  const router = express.Router();

  // Criar use case
  const registerIdentidadeUC = new RegisterIdentidade(identidadeRepository);

  // Criar controller com injeção de dependência
  const registerIdentidadeController = new RegisterIdentidadeController(
    registerIdentidadeUC
  );

  /**
   * POST /identidade/register
   * Registrar uma nova identidade
   * 
   * @body {
   *   nome: string,
   *   cpf: string,
   *   dataNascimento: string,
   *   genero: string,
   *   pronome?: string,
   *   email: string,
   *   telefone: string,
   *   senha: string,
   *   enderecoId: string
   * }
   * 
   * @returns {
   *   statusCode: 200,
   *   body: Identidade
   * } | {
   *   statusCode: 400,
   *   body: { message: string }
   * } | {
   *   statusCode: 500,
   *   body: { message: string }
   * }
   */
  router.post(
    "/register",
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Converter requisição Express em HttpRequest (protocolo do projeto)
        const httpRequest: HttpRequest = {
          body: req.body,
        };

        // Usar o controller
        const httpResponse = await registerIdentidadeController.handle(
          httpRequest
        );

        // Enviar resposta HTTP
        res.status(httpResponse.statusCode).json(httpResponse.body);
      } catch (error) {
        // Fallback para erro não previsto
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";

        res.status(500).json({
          message: `Erro ao processar requisição: ${errorMessage}`,
        });
      }
    }
  );

  return router;
}

/**
 * Exemplo de configuração completa da aplicação
 * 
 * Mostra como integrar o router com Express e middleware
 */
export function setupApplicationExample(): express.Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Adicionar headers de segurança (exemplo)
  app.use((req: Request, res: Response, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK" });
  });

  // Configurar rotas (exemplo com mock repository)
  // const mockRepository: IIdentidadeRepository = {
  //   async add(identidade: any) { },
  //   async exists(cpf: string) { return false; }
  // };

  // app.use("/api/identidade", createIdentidadeRouter(mockRepository));

  // Tratamento de rotas não encontradas
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      message: "Rota não encontrada",
    });
  });

  return app;
}

/**
 * Exemplo de testes de integração (e2e)
 */
export const integrationTestExample = `
import request from 'supertest';
import { setupApplicationExample } from './identidade.routes';

describe('POST /api/identidade/register', () => {
  it('deve registrar uma identidade com dados válidos', async () => {
    const app = setupApplicationExample();
    
    const response = await request(app)
      .post('/api/identidade/register')
      .send({
        nome: 'João Silva',
        cpf: '123.456.789-01',
        dataNascimento: '1990-01-15',
        genero: 'masculino',
        email: 'joao@example.com',
        telefone: '(11) 98765-4321',
        senha: 'senha123',
        enderecoId: 'endereco-123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cpf');
  });

  it('deve retornar 400 quando campo obrigatório falta', async () => {
    const app = setupApplicationExample();
    
    const response = await request(app)
      .post('/api/identidade/register')
      .send({
        nome: 'João Silva',
        // cpf faltando
        dataNascimento: '1990-01-15',
        genero: 'masculino',
        email: 'joao@example.com',
        telefone: '(11) 98765-4321',
        senha: 'senha123',
        enderecoId: 'endereco-123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Missing param');
  });
});
`;

/**
 * Exemplo de Cliente HTTP (usando fetch API)
 */
export const clientExampleFetch = `
// Exemplo de requisição usando fetch

const data = {
  nome: 'João Silva',
  cpf: '123.456.789-01',
  dataNascimento: '1990-01-15',
  genero: 'masculino',
  pronome: 'ele',
  email: 'joao@example.com',
  telefone: '(11) 98765-4321',
  senha: 'senha123',
  enderecoId: 'endereco-123'
};

try {
  const response = await fetch('http://localhost:3000/api/identidade/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (response.ok) {
    console.log('Sucesso:', result);
  } else {
    console.error('Erro:', result.message);
  }
} catch (error) {
  console.error('Erro de requisição:', error);
}
`;

/**
 * Exemplo de Cliente HTTP (usando axios)
 */
export const clientExampleAxios = `
import axios from 'axios';

const data = {
  nome: 'João Silva',
  cpf: '123.456.789-01',
  dataNascimento: '1990-01-15',
  genero: 'masculino',
  pronome: 'ele',
  email: 'joao@example.com',
  telefone: '(11) 98765-4321',
  senha: 'senha123',
  enderecoId: 'endereco-123'
};

try {
  const response = await axios.post(
    'http://localhost:3000/api/identidade/register',
    data
  );

  console.log('Sucesso:', response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('Erro:', error.response?.data?.message);
  } else {
    console.error('Erro:', error);
  }
}
`;
