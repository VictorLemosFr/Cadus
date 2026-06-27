import type { Identidade } from "../../../domain/entities/identidade/Identidade"
import type { Either } from "../../../shared/Either"

export type RegisterIdentidadeDTO = Either<Error | Error[], Identidade>;