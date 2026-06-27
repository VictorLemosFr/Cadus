import type { IEnderecoRespository } from "../../application/ports/respositories/IEnderecoRepository";
import { RegisterEnderecoController } from "../../presentation/controllers/RegisterEnderecoController";
import { RegisterEndereco } from "../../application/usecases/registrar-endereco/RegisterEndereco";
import { PrismaEnderecoRepository } from "../../infra/database/repsositories/PrismaEnderecoRepository";
// Singleton compartilhado para dev
import { devEnderecoRepo } from "../DevRepositories";

export const makeRegisterEnderecoController = (
  enderecoRepository?: IEnderecoRespository
): RegisterEnderecoController => {
  const isProd = !!process.env.NEON_DATABASE_URL;

  const repository =
    enderecoRepository ?? (isProd ? new PrismaEnderecoRepository() : devEnderecoRepo);

  const registerUseCase = new RegisterEndereco(repository);
  return new RegisterEnderecoController(registerUseCase);
};