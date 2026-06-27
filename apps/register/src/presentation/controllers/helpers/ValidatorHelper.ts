import { MissingParamError } from "../errors/MissingParamError";

/**
 * ValidatorHelper - Responsável por validações genéricas de parâmetros
 * Segue o princípio de Single Responsibility ao centralizar a lógica de validação
 */
export class ValidatorHelper {
  /**
   * Valida se todos os parâmetros obrigatórios estão presentes no objeto
   * @param data - Objeto com os dados a validar
   * @param requiredFields - Array com os nomes dos campos obrigatórios
   * @returns Array de erros encontrados, vazio se nenhum erro
   */
  static validateRequiredFields(
    data: Record<string, any>,
    requiredFields: string[]
  ): MissingParamError[] {
    const errors: MissingParamError[] = [];

    for (const field of requiredFields) {
      const value = data[field];
      
      // Considera valores faltantes: undefined, null ou string vazia
      if (value === undefined || value === null || value === "") {
        errors.push(new MissingParamError(field));
      }
    }

    return errors;
  }

  /**
   * Valida um único campo obrigatório
   * @param data - Objeto com os dados
   * @param field - Nome do campo a validar
   * @returns MissingParamError se o campo estiver faltando, undefined caso contrário
   */
  static validateRequiredField(
    data: Record<string, any>,
    field: string
  ): MissingParamError | undefined {
    const value = data[field];

    if (value === undefined || value === null || value === "") {
      return new MissingParamError(field);
    }

    return undefined;
  }
}
