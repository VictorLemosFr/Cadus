import type { IIdentidadeRepository } from "../../application/ports/respositories/IIdentidadeRepository";
import { FindIdentidade } from "../../application/usecases/find-identidade/FindIdentidade";
import { FindIdentidadeController } from "../../presentation/controllers/FindIdentidadeController";
import { PrismaIdentidadeRepository } from "../../infra/database/repsositories/PrismaIdentidadeRepository";
// Singleton compartilhado para dev
import { devIdentidadeRepo } from "../DevRepositories";

export const makeFindIdentidadeController = (
  identidadeRepository?: IIdentidadeRepository
): FindIdentidadeController => {
  const isProd = !!process.env.NEON_DATABASE_URL;

  const repository =
    identidadeRepository ?? (isProd ? new PrismaIdentidadeRepository() : devIdentidadeRepo);

  const findUseCase = new FindIdentidade(repository);
  return new FindIdentidadeController(findUseCase);
};