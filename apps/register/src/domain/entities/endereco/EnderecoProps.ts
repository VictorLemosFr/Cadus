import type { EnderecoId } from "./EnderecoId";
import type { Cep } from "./Cep";
import type { Logradouro } from "./Logradouro";
import type { Complemento } from "./Complemento";
import type { Numero } from "./Numero";

export interface EnderecoProps {
    cep: Cep;
    logradouro?: Logradouro | undefined;
    complemento?: Complemento | undefined;
    numero: Numero;
}