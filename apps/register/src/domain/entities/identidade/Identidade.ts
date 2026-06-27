import { IdentidadeId } from "./IdentidadeId";
import { EnderecoId } from "../endereco/EnderecoId";
import { Nome } from "./Nome";
import { Cpf } from "./Cpf";
import { Data } from "../../../shared/value-objects/Data";
import { Email } from "./Email";
import { Genero } from "./Genero";
import { Pronome } from "./Pronome";
import { Telefone } from "./Telefone";
import { Senha } from "./Senha";

import type { IdentidadeProps } from "./IdentidadeProps";
import type { IdentidadeDados } from "./IdentidadeDados";
import type { IdentidadeCreateInput } from "./IdentidadeCreateInput";

import { type Either, failure, success } from "../../../shared/Either";
import { Validation } from "../../../shared/Validation";
import { InvalidPronomeError } from "../../errors/InvalidPronome";

export class Identidade {
    private _id: IdentidadeId;
    private _props: IdentidadeProps;
    private _criadoEm: Data;
    private _atualizadoEm: Data;
    private _deletadoEm: Data | undefined;

    constructor(
        props: IdentidadeProps,
        IdentidadeId: IdentidadeId,
        criadoEm: Data,
        atualizadoEm: Data,
        deletadoEm?: Data
    ) {
        this._id = IdentidadeId;
        this._props = props;
        this._criadoEm = criadoEm;
        this._atualizadoEm = atualizadoEm;
        this._deletadoEm = deletadoEm;
    }

    public static create(
        { nome, cpf, dataNascimento, genero, pronome, email, telefone, enderecoId, senha, queixa }: IdentidadeCreateInput,
        IdentidadeId: IdentidadeId
    ): Either<Error[], Identidade> {

        const identidadeProps: Record<string, Either<Error, any>> = {
            nome: Nome.create(nome),
            cpf: Cpf.create(cpf),
            dataNascimento: Data.create(dataNascimento),
            genero: Genero.create(genero),
            pronome: pronome ? Pronome.create(pronome) : success<InvalidPronomeError, undefined>(undefined),
            email: Email.create(email),
            telefone: Telefone.create(telefone),
            enderecoId: EnderecoId.reconstitute(enderecoId),
            senha: Senha.create(senha),
            criadoEm: Data.create(new Date()),
            atualizadoEm: Data.create(new Date()),
        };

        const resultProps: Either<Error[], any> = Validation.combine(identidadeProps);

        if (resultProps.isError()) {
            return failure(resultProps.value);
        }

        const { criadoEm, atualizadoEm, ...props } = resultProps.value;

        return success(new Identidade({ ...props, queixa }, IdentidadeId, criadoEm, atualizadoEm));
    }

    public static reconstitute(
        props: IdentidadeProps,
        IdentidadeId: IdentidadeId,
        criadoEm: Data,
        atualizadoEm: Data,
        deletadoEm?: Data | undefined
    ): Identidade {
        return new Identidade(props, IdentidadeId, criadoEm, atualizadoEm, deletadoEm);
    }

    public get value(): IdentidadeProps { return this._props; }
    public get IdentidadeId(): IdentidadeId { return this._id; }
    public get nome(): Nome { return this._props.nome; }
    public get cpf(): Cpf { return this._props.cpf; }
    public get dataNascimento(): Data { return this._props.dataNascimento; }
    public get genero(): Genero { return this._props.genero; }
    public get pronome(): Pronome | undefined { return this._props.pronome; }
    public get email(): Email { return this._props.email; }
    public get telefone(): Telefone { return this._props.telefone; }
    public get senha(): Senha { return this._props.senha; }
    public get endereco(): EnderecoId { return this._props.enderecoId; }
    public get queixa(): string | undefined { return this._props.queixa; }
    public get status(): string | undefined { return this._props.status; }
    public get criadoEm(): Data { return this._criadoEm; }
    public get atualizadoEm(): Data { return this._atualizadoEm; }
}