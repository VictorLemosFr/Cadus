import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import { ok, badRequest, notFound, serverError } from "./helpers/HttpHelper";
import type { FindIdentidade } from "../../application/usecases/find-identidade/FindIdentidade";

export class FindIdentidadeController implements BaseController {
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
                return notFound(new Error(`Identidade com CPF '${cpf}' não encontrada`));
            }

            return ok(result.value);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Erro desconhecido";
            return serverError(errorMessage);
        }
    }
}