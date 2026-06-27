import { InMemoryIdentidadeRepo } from "../application/ports/respositories/in-memory-tests/InMemoryIdentidadeRepo";
import { InMemoryEnderecoRepository } from "../application/ports/respositories/in-memory-tests/InMemoryEnderecoRepository";

export const devIdentidadeRepo = new InMemoryIdentidadeRepo();
export const devEnderecoRepo = new InMemoryEnderecoRepository();