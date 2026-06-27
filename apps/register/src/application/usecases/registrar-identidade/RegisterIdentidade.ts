// Interfaces de Identidade para casos de uso
import type { IRegisterIdentidadeUC } from "../../ports/IRegisterIdentidadeUC"
import type { IIdentidadeRepository } from "../../ports/respositories/IIdentidadeRepository"
import type { IdentidadeDados } from "../../../domain/entities/identidade/IdentidadeDados";
import type { RegisterIdentidadeDTO } from "../../ports/dtos/RegisterIdentidadeDTO";
import type { IdentidadeProps } from "../../../domain/entities/identidade/IdentidadeProps";
import type { IRegisterEnderecoUC } from "../../ports/IRegisterEnderecoUC";
import type { IEnderecoRespository } from "../../ports/respositories/IEnderecoRepository";
// Entidade e Object Values do dominio
import { Identidade } from "../../../domain/entities/identidade/Identidade";
import { IdentidadeId } from "../../../domain/entities/identidade/IdentidadeId";
import type { EnderecoId } from "../../../domain/entities/endereco/EnderecoId";
import { Cep } from "../../../domain/entities/endereco/Cep";
import { Data } from "../../../shared/value-objects/Data";
// Funcoes auxiliares
import { CryptoIdGenerator } from "../../../infra/providers/CryptoIdGenerator";
// Providers
import { BcryptHashProvider, type HashProvider } from "../../../infra/providers/HashProvider";
// Utils
import { type Either, success, failure } from "../../../shared/Either";
// Errors
import { IdentidadeAlreadyExistsError } from "../../errors/RegistroIdentidadeError";
import { EnderecoAlreadyExists } from "../../errors/RegisterEnderecoError";

export class RegisterIdentidade implements IRegisterIdentidadeUC {
    private readonly _identidadeRepo: IIdentidadeRepository;
    private readonly _hashProvider: HashProvider;
    private readonly _registerEnderecoUC: IRegisterEnderecoUC;
    private readonly _enderecoRepo: IEnderecoRespository;
 
    constructor(
        identidadeRepo: IIdentidadeRepository,
        hashProvider: HashProvider,
        registerEnderecoUC: IRegisterEnderecoUC,
        enderecoRepo: IEnderecoRespository
    ) {
        this._identidadeRepo = identidadeRepo;
        this._hashProvider = hashProvider;
        this._registerEnderecoUC = registerEnderecoUC;
        this._enderecoRepo = enderecoRepo;
    }
 
    async registerIdentidade(identidadeDados: IdentidadeDados): Promise<RegisterIdentidadeDTO> {
 
        const newId = IdentidadeId.create(new CryptoIdGenerator().generate());
        if (newId.isError()) {
            // Retorna erro em caso de id nao seja valido
            return failure(newId.value);
        }
 
        // Resolve o endereço: cria um novo, ou reaproveita o existente pelo CEP
        const enderecoIdOrError = await this.resolveEnderecoId(identidadeDados.endereco);
        if (enderecoIdOrError.isError()) {
            return failure(enderecoIdOrError.value);
        }
        const enderecoId = enderecoIdOrError.value;
 
        // Hash da senha antes de criar a entidade
        identidadeDados.senha = await this._hashProvider.hash(identidadeDados.senha);
 
        const identidadeOrError: Either<Error[], Identidade> = Identidade.create(
            { ...identidadeDados, enderecoId: enderecoId.value },
            newId.value
        );
        if (identidadeOrError.isError()) {
            // Retorna conjunto de erros se a identidade nao estiver correta
            return failure(identidadeOrError.value);
        }
        const identidade: Identidade = identidadeOrError.value;
        const identidadeExists: boolean = await this._identidadeRepo.exists(identidade.cpf);
        if (identidadeExists) {
            // Retorna erro do caso de uso se ja existe o usuario
            return failure(new IdentidadeAlreadyExistsError("A identidade ja existe."));
        }
        else {
            await this._identidadeRepo.add(identidade);
        }
 
        return success(identidade);
    }
 
    /**
     * Resolve o EnderecoId a partir dos dados de endereço recebidos:
     * - Tenta criar um novo Endereco via RegisterEnderecoUC.
     * - Se o endereço já existir (EnderecoAlreadyExists), busca o existente
     *   pelo CEP e reaproveita seu id.
     * - Qualquer outro erro de validação do endereço é propagado.
     */
    private async resolveEnderecoId(
        enderecoDados: IdentidadeDados["endereco"]
    ): Promise<Either<Error | Error[], EnderecoId>> {
        const registroOrError = await this._registerEnderecoUC.registerEndereco(enderecoDados);
 
        if (registroOrError.isSuccess()) {
            return success(registroOrError.value.id);
        }
 
        const erro = registroOrError.value;
        const isEnderecoAlreadyExists = !Array.isArray(erro) && erro instanceof EnderecoAlreadyExists;
 
        if (!isEnderecoAlreadyExists) {
            return failure(erro);
        }
 
        const cepOrError = Cep.create(enderecoDados.cep);
        if (cepOrError.isError()) {
            return failure(cepOrError.value);
        }
 
        const enderecoExistente = await this._enderecoRepo.findEnderecoByCep(cepOrError.value);
        return success(enderecoExistente.id);
    }
}