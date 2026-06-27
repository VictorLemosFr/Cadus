import type { IRegisterIdentidadeUC } from "../../application/ports/IRegisterIdentidadeUC";
import { created, badRequest, serverError } from "./helpers/HttpHelper";
import { ValidatorHelper } from "./helpers/ValidatorHelper";
import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import type { IdentidadeDados } from "../../domain/entities/identidade/IdentidadeDados";

/**
 * RegisterIdentidadeController
 * 
 * - Valida dados da requisição HTTP
 * - Mapea dados HTTP para IdentidadeDados (DTO)
 * - Invoca o use case de registro
 * - Trata respostas e erros
 * 
 */
export class RegisterIdentidadeController implements BaseController {
  // Campos obrigatórios para registro de identidade
  private readonly REQUIRED_FIELDS = [
    "nome",
    "cpf",
    "dataNascimento",
    "genero",
    "email",
    "telefone",
    "senha",
    "endereco",
  ];

  // Injeção de dependência: depende da interface, não da implementação
  private readonly registerIdentidadeUC: IRegisterIdentidadeUC;

  constructor(registerIdentidadeUC: IRegisterIdentidadeUC) {
    this.registerIdentidadeUC = registerIdentidadeUC;
  }

  /**
   * Handler principal da requisição HTTP
   * @param req - Requisição HTTP contendo os dados do corpo
   * @returns Resposta HTTP com status apropriado
   */
  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      //  Verifica se body existe
      if (!req.body || typeof req.body !== "object") {
        return badRequest(
          new Error("Corpo da requisição deve ser um objeto válido")
        );
      }

      // Valida campos obrigatórios
      const validationErrors = ValidatorHelper.validateRequiredFields(
        req.body,
        this.REQUIRED_FIELDS
      );

      if (validationErrors.length > 0) {
        // Combina todas as mensagens de erro
        const errorMessage = validationErrors
          .map((err) => err.message)
          .join("; ");
        return badRequest(new Error(errorMessage));
      }

      // Transforma dados HTTP em IdentidadeDados
      const identidadeDados = this.mapRequestBodyToIdentidadeDados(req.body);

      // Invoca o use case
      const result = await this.registerIdentidadeUC.registerIdentidade(
        identidadeDados
      );

      // Processa resultado do use case (Either pattern)
      if (result.isError()) {
        return this.handleUseCaseError(result.value);
      }

      // Retorna identidade criada
      return created(result.value);

    } catch (error) {
      // Tratamento de erros inesperados
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return serverError(errorMessage);
    }
  }

  /**
   * Mapeia os dados da requisição HTTP para o DTO IdentidadeDados
   * Segue o princípio de Single Responsibility ao centralizar a lógica de mapeamento
   * 
   * @param body - Corpo da requisição
   * @returns IdentidadeDados mapeado
   */
  private mapRequestBodyToIdentidadeDados(
    body: Record<string, any>
  ): IdentidadeDados {
    return {
      nome: body.nome.trim(),
      cpf: body.cpf.replace(/\D/g, ""), // Remove caracteres não-numéricos
      dataNascimento: body.dataNascimento,
      genero: body.genero,
      pronome: body.pronome?.trim(), // Opcional
      email: body.email.trim().toLowerCase(),
      telefone: body.telefone.replace(/\D/g, ""), // Remove caracteres não-numéricos
      senha: body.senha,
      queixa: body.queixa?.trim(), // Opcional
      endereco: body.endereco,
    };
  }

  /**
   * Trata erros retornados pelo use case
   * Segue o princípio de Single Responsibility ao centralizar o tratamento de erros
   * 
   * @param error - Erro ou array de erros do use case
   * @returns Resposta HTTP com status apropriado
   */
  private handleUseCaseError(error: Error | Error[]): HttpResponse {
    // Se for um array de erros de validação do domínio
    if (Array.isArray(error)) {
      const errorMessages = error.map((err) => err.message).join("; ");
      return badRequest(new Error(`Dados inválidos: ${errorMessages}`));
    }

    // Se for um erro único
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Erros de validação retornam 400
      if (errorMessage.includes("já existe")) {
        return badRequest(error);
      }

      // Outros erros retornam 400
      return badRequest(error);
    }

    // Erro genérico
    return serverError("Erro ao processar a requisição");
  }
}
