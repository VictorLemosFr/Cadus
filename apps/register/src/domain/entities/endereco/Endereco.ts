import { InvalidEnderecoError } from "../../errors/InvalidEndereco";
import { type Either, success, failure } from "../../../shared/Either";
import type { EnderecoDados } from "./EnderecoDados";
import type { EnderecoProps} from "./EnderecoProps";

// VOs
import { EnderecoId } from "./EnderecoId";
import { Data } from "../../../shared/value-objects/Data";
import { Cep } from "./Cep";
import { Logradouro } from "./Logradouro";
import { Numero } from "./Numero";
import { Complemento } from "./Complemento";

// Validation
import { Validation } from "../../../shared/Validation";

// Utils
import { localDate } from "../../../shared/utils/CreateDate";

export class Endereco { 
    private _id: EnderecoId;
    private _props: EnderecoProps;
    private _criadoEm: Data;
    private _atualizadoEm: Data;
    private _deletadoEm: Data | undefined;

    constructor (
        props: EnderecoProps, 
        id: EnderecoId,
        criadoEm: Data,
        atualizadoEm: Data,
        deletadoEm?: Data | undefined
    ) {
        this._id = id;
        this._props = props;
        this._criadoEm = criadoEm;
        this._atualizadoEm = atualizadoEm;
        this._deletadoEm = deletadoEm;
    }
    
    public static create (
        {cep, logradouro, numero, complemento }: EnderecoDados, 
        id: EnderecoId, 
    ): Either<Error[], Endereco> {

        const validations: Record<string, Either<Error, any>> = {
            cep: Cep.create(cep),
            logradouro: Logradouro.create(logradouro),
            numero: Numero.create(Number(numero)),
            complemento: Complemento.create(complemento),
            criadoEm: Data.create(localDate()),
            atualizadoEm: Data.create(localDate())
        } 

        const resultado: Either<Error[], any> = Validation.combine(validations);

        if (resultado.isError()){
            return failure(resultado.value);
        }

        const { criadoEm, atualizadoEm, ...props} = resultado.value;

        return success(new Endereco(props, id, criadoEm, atualizadoEm));
    }

    public static reconstitute (
        props: EnderecoProps,
        id: EnderecoId,
        criadoEm: Data,
        atualizadoEm: Data,
        deletadoEm?: Data | undefined
    ): Endereco {
        return new Endereco(props, id, criadoEm, atualizadoEm, deletadoEm);
    }

    // Getters e Setters
    public get value (): EnderecoProps {
        return this._props;
    }

    public get id (): EnderecoId  {
        return this._id;
    }

    public get cep (): Cep {
        return this._props.cep;
    }

    public get logradouro (): Logradouro | undefined {
        return this._props.logradouro;
    }

    public get numero (): Numero {
        return this._props.numero;
    }

    public get complemento (): Complemento | undefined {
        return this._props.complemento;
    }

    public get criadoEm (): Data {
        return this._criadoEm;
    }

    public get atualizadoEm(): Data {
        return this._atualizadoEm;
    }

    public get deletadoEm(): Data | undefined {
        return this._deletadoEm;
    }

}