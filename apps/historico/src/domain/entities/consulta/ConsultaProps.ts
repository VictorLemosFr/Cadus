import type { MotivoConsulta } from "./MotivoConsulta";
import type { Diagnostico } from "./Diagnostico";
import type { Instituicao } from "./Instituicao";
import type { Data } from "../../../shared/value-objects/Data";

export interface ConsultaProps {
  pacienteId:     string;
  profissionalId: string;
  motivoConsulta: MotivoConsulta;
  diagnostico:    Diagnostico | undefined;
  instituicao:    Instituicao;
  dataConsulta:   Data;
}
