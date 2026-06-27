import type { Consulta } from "../../domain/entities/consulta/Consulta";
import type { Either } from "../../shared/Either";

export type RegistrarConsultaDTO = Either<Error | Error[], Consulta>;
