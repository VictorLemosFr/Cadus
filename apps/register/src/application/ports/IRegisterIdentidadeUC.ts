import type { IdentidadeDados } from "../../domain/entities/identidade/IdentidadeDados";
import type { RegisterIdentidadeDTO } from "./dtos/RegisterIdentidadeDTO";

export interface IRegisterIdentidadeUC {
    registerIdentidade: (identidade: IdentidadeDados) => Promise<RegisterIdentidadeDTO>;
}