import { ConsultaId } from "./ConsultaId";
import { MotivoConsulta } from "./MotivoConsulta";
import { Diagnostico } from "./Diagnostico";
import { Instituicao } from "./Instituicao";
import { Data } from "../../../shared/value-objects/Data";
import type { ConsultaProps } from "./ConsultaProps";
import { type Either, failure, success } from "../../../shared/Either";
import { Validation } from "../../../shared/Validation";

export interface ConsultaDados {
  pacienteId:     string;
  profissionalId: string;
  motivoConsulta: string;
  diagnostico?:   string;
  instituicao:    string;
  dataConsulta:   Date;
}

export class Consulta {
  private _id:        ConsultaId;
  private _props:     ConsultaProps;
  private _criadoEm:  Data;

  private constructor(id: ConsultaId, props: ConsultaProps, criadoEm: Data) {
    this._id       = id;
    this._props    = props;
    this._criadoEm = criadoEm;
  }

  public static create(
    dados: ConsultaDados,
    id: ConsultaId
  ): Either<Error[], Consulta> {
    const consultaProps: Record<string, Either<Error, any>> = {
      motivoConsulta: MotivoConsulta.create(dados.motivoConsulta),
      diagnostico:    dados.diagnostico
        ? Diagnostico.create(dados.diagnostico)
        : success(undefined),
      instituicao:    Instituicao.create(dados.instituicao),
      dataConsulta:   Data.create(dados.dataConsulta),
      criadoEm: Data.create(new Date().toLocaleDateString("pt-BR")),
    };

    const result = Validation.combine(consultaProps);
    if (result.isError()) return failure(result.value);

    const { criadoEm, ...props } = result.value;

    return success(new Consulta(id, {
      pacienteId:     dados.pacienteId,
      profissionalId: dados.profissionalId,
      ...props,
    }, criadoEm));
  }

  public static reconstitute(
    id: ConsultaId,
    props: ConsultaProps,
    criadoEm: Data
  ): Consulta {
    return new Consulta(id, props, criadoEm);
  }

  public get consultaId():     ConsultaId     { return this._id; }
  public get props():          ConsultaProps  { return this._props; }
  public get pacienteId():     string         { return this._props.pacienteId; }
  public get profissionalId(): string         { return this._props.profissionalId; }
  public get motivoConsulta(): MotivoConsulta { return this._props.motivoConsulta; }
  public get diagnostico():    Diagnostico | undefined { return this._props.diagnostico; }
  public get instituicao():    Instituicao    { return this._props.instituicao; }
  public get dataConsulta():   Data           { return this._props.dataConsulta; }
  public get criadoEm():       Data           { return this._criadoEm; }
}
