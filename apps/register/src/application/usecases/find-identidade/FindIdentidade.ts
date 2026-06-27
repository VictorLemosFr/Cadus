import type { IIdentidadeRepository } from "../../ports/respositories/IIdentidadeRepository";
import type { Identidade } from "../../../domain/entities/identidade/Identidade";
import { Cpf } from "../../../domain/entities/identidade/Cpf";
import { type Either, success, failure } from "../../../shared/Either";

export class FindIdentidade {
    private readonly _identidadeRepo: IIdentidadeRepository;

    constructor(identidadeRepo: IIdentidadeRepository) {
        this._identidadeRepo = identidadeRepo;
    }

    async findByCpf(cpfRaw: string): Promise<Either<Error, Identidade | null>> {
        const cpfOrError = Cpf.create(cpfRaw);
        if (cpfOrError.isError()) {
            return failure(cpfOrError.value);
        }

        const identidade = await this._identidadeRepo.findIdentidadeByCpf(cpfOrError.value);
        return success(identidade);
    }
}