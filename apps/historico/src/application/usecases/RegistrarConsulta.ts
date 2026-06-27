import type { IRegistrarConsultaUC } from "../ports/IRegistrarConsultaUC";
import type { IConsultaRepository } from "../ports/IConsultaRepository";
import type { ConsultaDados } from "../../domain/entities/consulta/Consulta";
import type { RegistrarConsultaDTO } from "../dtos/RegistrarConsultaDTO";
import { Consulta } from "../../domain/entities/consulta/Consulta";
import { ConsultaId } from "../../domain/entities/consulta/ConsultaId";
import { CryptoIdGenerator } from "../../infra/adapters/CryptoIdGenerator";
import { failure, success } from "../../shared/Either";

export class RegistrarConsulta implements IRegistrarConsultaUC {
  private readonly _consultaRepo: IConsultaRepository;

  constructor(consultaRepo: IConsultaRepository) {
    this._consultaRepo = consultaRepo;
  }

  async registrar(dados: ConsultaDados): Promise<RegistrarConsultaDTO> {
    const novoId = ConsultaId.create(new CryptoIdGenerator().generate());
    if (novoId.isError()) return failure(novoId.value);

    const consultaOrError = Consulta.create(dados, novoId.value);
    if (consultaOrError.isError()) return failure(consultaOrError.value);

    const consulta = consultaOrError.value;

    await this._consultaRepo.add({
      id:             consulta.consultaId.value,
      pacienteId:     consulta.pacienteId,
      profissionalId: consulta.profissionalId,
      motivoConsulta: consulta.motivoConsulta,
      diagnostico:    consulta.diagnostico,
      instituicao:    consulta.instituicao,
      dataConsulta:   consulta.dataConsulta,
      criadoEm:       new Date(),
    });

    return success(consulta);
  }
}