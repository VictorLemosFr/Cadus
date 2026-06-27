import type { IIdentidadeRepository } from "../../application/ports/respositories/IIdentidadeRepository";
import type { IEnderecoRespository } from "../../application/ports/respositories/IEnderecoRepository";
import { RegisterIdentidadeController } from "../../presentation/controllers/RegisterIdentidadeController";
import { RegisterIdentidade } from "../../application/usecases/registrar-identidade/RegisterIdentidade";
import { RegisterEndereco } from "../../application/usecases/registrar-endereco/RegisterEndereco";
import { BcryptHashProvider } from "../../infra/providers/HashProvider";
import { PrismaIdentidadeRepository } from "../../infra/database/repsositories/PrismaIdentidadeRepository";
import { PrismaEnderecoRepository } from "../../infra/database/repsositories/PrismaEnderecoRepository";
// Singletons compartilhados — garantem que POST e GET usam o mesmo estado em dev
import { devIdentidadeRepo, devEnderecoRepo } from "../DevRepositories";

export const makeRegisterIdentidadeController = (
  identidadeRepository?: IIdentidadeRepository,
  enderecoRepository?: IEnderecoRespository
): RegisterIdentidadeController => {
  // Em produção usa Prisma; em dev usa o singleton InMemory compartilhado
  const isProd = !!process.env.NEON_DATABASE_URL;

  const repositoryIdentidade =
    identidadeRepository ?? (isProd ? new PrismaIdentidadeRepository() : devIdentidadeRepo);

  const repositoryEndereco =
    enderecoRepository ?? (isProd ? new PrismaEnderecoRepository() : devEnderecoRepo);

  const registerEnderecoUC = new RegisterEndereco(repositoryEndereco);
  const hashProvider = new BcryptHashProvider();
  const registerUseCase = new RegisterIdentidade(
    repositoryIdentidade,
    hashProvider,
    registerEnderecoUC,
    repositoryEndereco
  );
  return new RegisterIdentidadeController(registerUseCase);
};