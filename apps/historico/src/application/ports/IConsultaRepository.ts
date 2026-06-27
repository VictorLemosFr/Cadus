import type { Consulta } from "../../domain/entities/consulta/Consulta";
import type { ConsultaProps } from "../../domain/entities/consulta/ConsultaProps";

export interface IConsultaRepository {
  add(consulta: ConsultaProps & { id: string; criadoEm: Date }): Promise<void>;
  findByPacienteId(pacienteId: string): Promise<Consulta[]>;
}
