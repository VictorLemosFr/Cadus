import type { IdentidadeDados } from "./IdentidadeDados";

export type IdentidadeCreateInput = Omit<IdentidadeDados, "endereco"> & {
    enderecoId: string;
};