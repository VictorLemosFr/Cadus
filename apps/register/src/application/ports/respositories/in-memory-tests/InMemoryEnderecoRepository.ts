import type { Cep } from "../../../../domain/entities/endereco/Cep";
import type { Endereco } from "../../../../domain/entities/endereco/Endereco";
import type { IEnderecoRespository } from "../IEnderecoRepository";

export class InMemoryEnderecoRepository implements IEnderecoRespository {
  private readonly enderecos: Endereco[] = [];

  constructor(enderecos: Endereco[] = []) {
    this.enderecos = enderecos;
  }

  async add(endereco: Endereco): Promise<void> {
    const existsEndereco = await this.exists(endereco.cep);
    if (!existsEndereco) {
      this.enderecos.push(endereco);
    }
  }

  async exists(cep: Cep): Promise<boolean> {
    return this.enderecos.some((e) => e.cep.value === cep.value);
  }

  async findEnderecoByCep(cep: Cep): Promise<Endereco> {
    const found = this.enderecos.find((e) => e.cep.value === cep.value);

    if (!found) {
      throw new Error(`Endereço com CEP "${cep.value}" não encontrado.`);
    }

    return found;
  }

  async findAllEnderecos(): Promise<Endereco[]> {
    return this.enderecos;
  }
}