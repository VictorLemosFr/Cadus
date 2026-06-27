import type { IEnderecoRespository } from "../../ports/respositories/IEnderecoRepository";
import type { Endereco } from "../../../domain/entities/endereco/Endereco";
import { Cep } from "../../../domain/entities/endereco/Cep";
import { type Either, success, failure } from "../../../shared/Either";

export class FindEndereco {
    private readonly _enderecoRepo: IEnderecoRespository;

    constructor(enderecoRepo: IEnderecoRespository) {
        this._enderecoRepo = enderecoRepo;
    }

    async findByCep(cepRaw: string): Promise<Either<Error, Endereco>> {
        const cepOrError = Cep.create(cepRaw);
        if (cepOrError.isError()) {
            return failure(cepOrError.value);
        }

        const endereco = await this._enderecoRepo.findEnderecoByCep(cepOrError.value);
        return success(endereco);
    }
}