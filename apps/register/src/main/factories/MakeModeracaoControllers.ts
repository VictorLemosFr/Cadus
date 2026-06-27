import type { IIdentidadeRepository } from "../../application/ports/respositories/IIdentidadeRepository";
import { ListarPacientes } from "../../application/usecases/listar-pacientes/ListarPacientes";
import { MudarStatusPaciente } from "../../application/usecases/mudar-status/MudarStatusPaciente";
import { ListarPacientesController } from "../../presentation/controllers/ListarPacientesController";
import { MudarStatusController } from "../../presentation/controllers/MudarStatusController";
import { PrismaIdentidadeRepository } from "../../infra/database/repsositories/PrismaIdentidadeRepository";
import { devIdentidadeRepo } from "../DevRepositories";

// Mesmo padrão das outras factories: usa Prisma se houver NEON_DATABASE_URL
function resolveRepo(repo?: IIdentidadeRepository): IIdentidadeRepository {
    const isProd = !!process.env.NEON_DATABASE_URL;
    return repo ?? (isProd ? new PrismaIdentidadeRepository() : devIdentidadeRepo);
}

export const makeListarPacientesController = (
    repo?: IIdentidadeRepository
): ListarPacientesController => {
    const repository = resolveRepo(repo);
    return new ListarPacientesController(new ListarPacientes(repository));
};

export const makeMudarStatusController = (
    repo?: IIdentidadeRepository
): MudarStatusController => {
    const repository = resolveRepo(repo);
    return new MudarStatusController(new MudarStatusPaciente(repository));
};