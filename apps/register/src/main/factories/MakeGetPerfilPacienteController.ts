import type { IIdentidadeRepository } from "../../application/ports/respositories/IIdentidadeRepository";
import { FindIdentidade } from "../../application/usecases/find-identidade/FindIdentidade";
import { GetPerfilPacienteController } from "../../presentation/controllers/GetPerfilPacienteController";
import { PrismaIdentidadeRepository } from "../../infra/database/repsositories/PrismaIdentidadeRepository";
import { devIdentidadeRepo } from "../DevRepositories";

export const makeGetPerfilPacienteController = (
    repo?: IIdentidadeRepository
): GetPerfilPacienteController => {
    const isProd = !!process.env.NEON_DATABASE_URL;
    const repository = repo ?? (isProd ? new PrismaIdentidadeRepository() : devIdentidadeRepo);
    return new GetPerfilPacienteController(new FindIdentidade(repository));
};