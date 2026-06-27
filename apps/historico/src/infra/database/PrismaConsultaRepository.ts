import type { IConsultaRepository } from "../../application/ports/IConsultaRepository";
import type { Consulta } from "../../domain/entities/consulta/Consulta";
import { ConsultaId } from "../../domain/entities/consulta/ConsultaId";
import { MotivoConsulta } from "../../domain/entities/consulta/MotivoConsulta";
import { Diagnostico } from "../../domain/entities/consulta/Diagnostico";
import { Instituicao } from "../../domain/entities/consulta/Instituicao";
import { Data } from "../../shared/value-objects/Data";
import { Consulta as ConsultaEntity } from "../../domain/entities/consulta/Consulta";
import { prisma } from "../adapters/db";

export class PrismaConsultaRepository implements IConsultaRepository {
  async add(dados: {
    id:             string;
    pacienteId:     string;
    profissionalId: string;
    motivoConsulta: any;
    diagnostico:    any;
    instituicao:    any;
    dataConsulta:   any;
    criadoEm:       Date;
  }): Promise<void> {
    await prisma.consulta.create({
      data: {
        id:             dados.id,
        pacienteId:     dados.pacienteId,
        profissionalId: dados.profissionalId,
        motivoConsulta: dados.motivoConsulta.value,
        diagnostico:    dados.diagnostico?.value,
        instituicao:    dados.instituicao.value,
        dataConsulta:   dados.dataConsulta.value,
        criadoEm:       dados.criadoEm,
      },
    });
  }

  async findByPacienteId(pacienteId: string): Promise<Consulta[]> {
    const rows = await prisma.consulta.findMany({
      where: { pacienteId },
      orderBy: { dataConsulta: "desc" },
    });

    return rows.map((row: any) => {
      const id           = ConsultaId.create(row.id).value as ConsultaId;
      const motivo       = MotivoConsulta.create(row.motivoConsulta).value as MotivoConsulta;
      const diagnostico  = row.diagnostico ? Diagnostico.create(row.diagnostico).value as Diagnostico : undefined;
      const instituicao  = Instituicao.create(row.instituicao).value as Instituicao;
      const dataConsulta = Data.create(row.dataConsulta).value as Data;
      const criadoEm     = Data.create(row.criadoEm).value as Data;

      return ConsultaEntity.reconstitute(id, {
        pacienteId:     row.pacienteId,
        profissionalId: row.profissionalId,
        motivoConsulta: motivo,
        diagnostico,
        instituicao,
        dataConsulta,
      }, criadoEm);
    });
  }
}