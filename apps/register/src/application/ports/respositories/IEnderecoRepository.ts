import type { Endereco } from "../../../domain/entities/endereco/Endereco";
import type { Cep } from "../../../domain/entities/endereco/Cep";

export interface IEnderecoRespository {
    add (endereco: Endereco): Promise<void>
    exists (cep: Cep): Promise<boolean>
    findEnderecoByCep (cep: Cep): Promise<Endereco>
    findAllEnderecos (): Promise<Endereco[]>
}