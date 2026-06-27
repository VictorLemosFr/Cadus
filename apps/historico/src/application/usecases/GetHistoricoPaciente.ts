import type { IConsultaRepository } from "../ports/IConsultaRepository";
import type { Consulta } from "../../domain/entities/consulta/Consulta";

export class GetHistoricoPaciente {
  private readonly _consultaRepo: IConsultaRepository;

  constructor(consultaRepo: IConsultaRepository) {
    this._consultaRepo = consultaRepo;
  }

  async execute(pacienteId: string): Promise<Consulta[]> {
    if (!pacienteId || pacienteId.trim().length === 0) {
      throw new Error("pacienteId não pode ser vazio");
    }
    return this._consultaRepo.findByPacienteId(pacienteId);
  }
}