import type { ConsultaDados } from "../../domain/entities/consulta/Consulta";
import type { RegistrarConsultaDTO } from "../dtos/RegistrarConsultaDTO";

export interface IRegistrarConsultaUC {
  registrar(dados: ConsultaDados): Promise<RegistrarConsultaDTO>;
}
