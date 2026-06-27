import type { IIdentidadeRepository } from "../../ports/respositories/IIdentidadeRepository";
import { Cpf } from "../../../domain/entities/identidade/Cpf";
import { type Either, success, failure } from "../../../shared/Either";
import { STATUS_VALIDOS, type StatusPaciente } from "../listar-pacientes/ListarPacientes";

export class MudarStatusPaciente {
    private readonly _identidadeRepo: IIdentidadeRepository;

    constructor(identidadeRepo: IIdentidadeRepository) {
        this._identidadeRepo = identidadeRepo;
    }

    async execute(cpfRaw: string, novoStatus: string): Promise<Either<Error, void>> {
        // Valida o status
        if (!STATUS_VALIDOS.includes(novoStatus as StatusPaciente)) {
            return failure(new Error(`Status inválido: ${novoStatus}. Use um de: ${STATUS_VALIDOS.join(", ")}`));
        }

        // Valida o CPF
        const cpfOrError = Cpf.create(cpfRaw);
        if (cpfOrError.isError()) {
            return failure(cpfOrError.value);
        }

        // Garante que o paciente existe antes de atualizar
        const existe = await this._identidadeRepo.findIdentidadeByCpf(cpfOrError.value);
        if (existe === null) {
            return failure(new Error(`Paciente com CPF '${cpfRaw}' não encontrado`));
        }

        await this._identidadeRepo.updateStatus(cpfOrError.value, novoStatus);
        return success(undefined);
    }
}