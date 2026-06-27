import type { IIdentidadeRepository } from "../../application/ports/respositories/IIdentidadeRepository";
import { FindIdentidade } from "../../application/usecases/find-identidade/FindIdentidade";
import { GetUsuarioByCpfController } from "../../presentation/controllers/GetUsuarioByCpfController";
import { PrismaIdentidadeRepository } from "../../infra/database/repsositories/PrismaIdentidadeRepository";
// Singleton compartilhado para dev
import { devIdentidadeRepo } from "../DevRepositories";

export const makeGetUsuarioByCpfController = (
  identidadeRepository?: IIdentidadeRepository
): GetUsuarioByCpfController => {
  const isProd = !!process.env.NEON_DATABASE_URL;

  const repository =
    identidadeRepository ?? (isProd ? new PrismaIdentidadeRepository() : devIdentidadeRepo);

  const findUseCase = new FindIdentidade(repository);
  return new GetUsuarioByCpfController(findUseCase);
};