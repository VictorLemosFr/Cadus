import type { EnderecoDados } from "../../../domain/entities/endereco/EnderecoDados";
import { IdentidadeId } from "../../../domain/entities/identidade/IdentidadeId";
import { CryptoIdGenerator } from "../../../infra/providers/CryptoIdGenerator";
import type { RegisterEnderecoDTO } from "../../ports/dtos/RegisterEnderecoDTO";
import type { IEnderecoRespository } from "../../ports/respositories/IEnderecoRepository";
import type { IRegisterEnderecoUC } from "../../ports/IRegisterEnderecoUC";

// Utils
import { type Either, success, failure } from "../../../shared/Either";


import { EnderecoId } from "../../../domain/entities/endereco/EnderecoId";
import { Endereco } from "../../../domain/entities/endereco/Endereco";
import { EnderecoAlreadyExists } from "../../errors/RegisterEnderecoError";

export class RegisterEndereco implements IRegisterEnderecoUC {
    private readonly _enderecoRepo: IEnderecoRespository;
    constructor(enderecoRepo: IEnderecoRespository) {
        this._enderecoRepo = enderecoRepo;
    }
    async registerEndereco (enderecoDados: EnderecoDados): Promise<RegisterEnderecoDTO>{
        const newId: Either<Error, EnderecoId> = EnderecoId.create(new CryptoIdGenerator().generate());
        if (newId.isError()) {
            return failure(newId.value);
        }

        const enderecoOrError: Either<Error[], Endereco> = Endereco.create(enderecoDados, newId.value);
        if (enderecoOrError.isError()) {
            return failure(enderecoOrError.value);
        }
        const endereco: Endereco = enderecoOrError.value;

        const enderecoExists: boolean = await this._enderecoRepo.exists(endereco.cep);
        if (enderecoExists) {
            return failure(new EnderecoAlreadyExists("O endereco ja existe."));
        }
        else {
            await this._enderecoRepo.add(endereco);
        }

        return success(endereco);
    }
}