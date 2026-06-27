import type { Endereco } from "../../../domain/entities/endereco/Endereco";
import type { Either } from "../../../shared/Either";

export type RegisterEnderecoDTO = Either<Error | Error[], Endereco>;