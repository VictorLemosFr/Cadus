import type { IRegisterEnderecoUC } from "../../application/ports/IRegisterEnderecoUC";
import { ok, badRequest, serverError } from "./helpers/HttpHelper";
import { ValidatorHelper } from "./helpers/ValidatorHelper";
import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import type { EnderecoDados } from "../../domain/entities/endereco/EnderecoDados";

/**
 * RegisterEnderecoController
 *
 * - Valida dados da requisição HTTP
 * - Mapea dados HTTP para EnderecoDados (DTO)
 * - Invoca o use case de registro
 * - Trata respostas e erros
 */
export class RegisterEnderecoController implements BaseController {
  // Campos obrigatórios para registro de endereço
  private readonly REQUIRED_FIELDS = [
    "cep",
    "logradouro",
    "numero",
  ];

  // Injeção de dependência: depende da interface, não da implementação
  private readonly registerEnderecoUC: IRegisterEnderecoUC;

  constructor(registerEnderecoUC: IRegisterEnderecoUC) {
    this.registerEnderecoUC = registerEnderecoUC;
  }

  /**
   * Handler principal da requisição HTTP
   * @param req - Requisição HTTP contendo os dados do corpo
   * @returns Resposta HTTP com status apropriado
   */
  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      // Validação 1: Verificar se body existe
      if (!req.body || typeof req.body !== "object") {
        return badRequest(
          new Error("Corpo da requisição deve ser um objeto válido")
        );
      }

      // Validação 2: Validar campos obrigatórios
      const validationErrors = ValidatorHelper.validateRequiredFields(
        req.body,
        this.REQUIRED_FIELDS
      );

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors
          .map((err) => err.message)
          .join("; ");
        return badRequest(new Error(errorMessage));
      }

      // Mapeamento 3: Transformar dados HTTP em EnderecoDados
      const enderecoDados = this.mapRequestBodyToEnderecoDados(req.body);

      // Execução 4: Invocar o use case
      const result = await this.registerEnderecoUC.registerEndereco(
        enderecoDados
      );

      // Tratamento 5: Processar resultado do use case (Either pattern)
      if (result.isError()) {
        return this.handleUseCaseError(result.value);
      }

      // Sucesso 6: Retornar endereço criado com status 201
      return {
        statusCode: 201,
        body: result.value,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return serverError(errorMessage);
    }
  }

  /**
   * Mapeia os dados da requisição HTTP para o DTO EnderecoDados
   * Segue o princípio de Single Responsibility ao centralizar a lógica de mapeamento
   *
   * @param body - Corpo da requisição
   * @returns EnderecoDados mapeado
   */
  private mapRequestBodyToEnderecoDados(
    body: Record<string, any>
  ): EnderecoDados {
    return {
      cep: body.cep.trim(),
      logradouro: body.logradouro.trim(),
      numero: Number(body.numero),
      complemento: body.complemento?.trim(),
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

      // Erros de endereço já existente retornam 409 Conflict
      if (errorMessage.includes("já existe")) {
        return {
          statusCode: 409,
          body: { message: errorMessage },
        };
      }

      // Outros erros retornam 400
      return badRequest(error);
    }

    // Erro genérico
    return serverError("Erro ao processar a requisição");
  }
}
