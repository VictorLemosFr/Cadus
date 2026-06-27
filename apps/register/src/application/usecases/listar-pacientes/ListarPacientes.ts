import type { IIdentidadeRepository } from "../../ports/respositories/IIdentidadeRepository";
import type { Identidade } from "../../../domain/entities/identidade/Identidade";

// Status válidos na fila de moderação — fonte única de verdade
export const STATUS_VALIDOS = [
    "AGUARDANDO_MODERACAO",
    "ENCAMINHADO",
    "EM_ATENDIMENTO",
    "CONCLUIDO",
] as const;

export type StatusPaciente = (typeof STATUS_VALIDOS)[number];

export class ListarPacientes {
    private readonly _identidadeRepo: IIdentidadeRepository;

    constructor(identidadeRepo: IIdentidadeRepository) {
        this._identidadeRepo = identidadeRepo;
    }

    /**
     * Lista pacientes. Se um status for passado, filtra por ele.
     * Sem status, devolve todos (via findAllIdentidades).
     */
    async execute(status?: string): Promise<Identidade[]> {
        if (status) {
            if (!STATUS_VALIDOS.includes(status as StatusPaciente)) {
                throw new Error(`Status inválido: ${status}`);
            }
            return this._identidadeRepo.findByStatus(status);
        }

        const todas = await this._identidadeRepo.findAllIdentidades();
        return todas ?? [];
    }
}