import { type Either, success, failure } from "./Either.ts";

type CreateFn<TDados, TEntidade> = (dados: TDados, ...args: any[]) => Either<Error[], TEntidade>;

export class ClassBuilder<TDados, TEntidade> {
  private createFn: CreateFn<TDados, TEntidade>;
  private defaultDados: TDados;

  constructor(createFn: CreateFn<TDados, TEntidade>, defaultDados: TDados) {
    this.createFn = createFn;
    this.defaultDados = defaultDados;
  }

  make(override: Partial<TDados> = {}, ...args: any[]): Either<Error | Error[], TEntidade> {
    const dados = { ...this.defaultDados, ...override };
    return this.createFn(dados, ...args);
  }


  extractProps<TProps = any>(override: Partial<TDados> = {}, ...args: any[]): Either<Error | Error[], TProps> {
    const result = this.make(override, ...args);

    if (result.isError()) {
      // Retorna o próprio resultado convertido para o tipo esperado de erro
      return failure(result.value) as Either<Error[], TProps>;
    }

    const entidade = result.value;
    
    // Tenta buscar de .props ou .value, caso contrário usa a própria entidade
    const props = (entidade as any).props || (entidade as any).value || entidade;

    // Retorna o Driver de Sucesso contendo as propriedades limpas
    return success(props) as Either<Error[], TProps>;
  }
}