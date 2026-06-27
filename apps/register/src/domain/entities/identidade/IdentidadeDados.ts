import type { EnderecoDados } from "../endereco/EnderecoDados";

export interface IdentidadeDados {
    nome: string;
    cpf: string;
    dataNascimento: string;

    genero: string;
    pronome?: string;

    email: string;
    telefone: string;
    senha: string;

    // Queixa principal — opcional porque profissionais não têm queixa
    queixa?: string;

    endereco: EnderecoDados;
}