import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import { ok, badRequest, notFound, serverError } from "./helpers/HttpHelper";
import type { FindIdentidade } from "../../application/usecases/find-identidade/FindIdentidade";

/**
 * Devolve um perfil LIMPO e SEGURO do paciente.
 * Usado pela PatientHomepage no frontend.
 */
export class GetPerfilPacienteController implements BaseController {
    private readonly findIdentidadeUC: FindIdentidade;

    constructor(findIdentidadeUC: FindIdentidade) {
        this.findIdentidadeUC = findIdentidadeUC;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const cpf = req.params?.cpf;
            if (!cpf || typeof cpf !== "string") {
                return badRequest(new Error("Parâmetro 'cpf' é obrigatório"));
            }

            const result = await this.findIdentidadeUC.findByCpf(cpf);

            if (result.isError()) {
                return badRequest(result.value);
            }
            if (result.value === null) {
                return notFound(new Error(`Paciente com CPF '${cpf}' não encontrado`));
            }

            const p = result.value;

            // Monta um JSON liso — NUNCA inclui senha
            return ok({
                nome: p.nome.value,
                cpf: p.cpf.value,
                dataNascimento: p.dataNascimento.value,
                genero: p.genero.value,
                email: p.email.value,
                telefone: p.telefone.value,
                queixa: p.queixa ?? null,
                status: p.status ?? null,
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido";
            return serverError(msg);
        }
    }
}