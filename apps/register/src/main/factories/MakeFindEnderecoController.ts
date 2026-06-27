import type { IEnderecoRespository } from "../../application/ports/respositories/IEnderecoRepository";
import { FindEndereco } from "../../application/usecases/find-endereco/FindEndereco";
import { FindEnderecoController } from "../../presentation/controllers/FindEnderecoController";
import { PrismaEnderecoRepository } from "../../infra/database/repsositories/PrismaEnderecoRepository";
// Singleton compartilhado para dev
import { devEnderecoRepo } from "../DevRepositories";

export const makeFindEnderecoController = (
  enderecoRepository?: IEnderecoRespository
): FindEnderecoController => {
  const isProd = !!process.env.NEON_DATABASE_URL;

  const repository =
    enderecoRepository ?? (isProd ? new PrismaEnderecoRepository() : devEnderecoRepo);

  const findUseCase = new FindEndereco(repository);
  return new FindEnderecoController(findUseCase);
};