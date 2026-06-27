import type { EnderecoDados } from "../../domain/entities/endereco/EnderecoDados";
import type { RegisterEnderecoDTO } from "./dtos/RegisterEnderecoDTO";

export interface IRegisterEnderecoUC {
    registerEndereco: (enderecoDados: EnderecoDados) => Promise<RegisterEnderecoDTO>;
}