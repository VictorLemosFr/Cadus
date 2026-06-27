import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import { ok, badRequest, notFound, serverError } from "./helpers/HttpHelper";
import type { FindEndereco } from "../../application/usecases/find-endereco/FindEndereco";

export class FindEnderecoController implements BaseController {
    private readonly findEnderecoUC: FindEndereco;

    constructor(findEnderecoUC: FindEndereco) {
        this.findEnderecoUC = findEnderecoUC;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const cep = req.params?.cep;

            if (!cep || typeof cep !== "string") {
                return badRequest(new Error("Parâmetro 'cep' é obrigatório"));
            }

            const result = await this.findEnderecoUC.findByCep(cep);

            if (result.isError()) {
                return badRequest(result.value);
            }

            return ok(result.value);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Erro desconhecido";
            return serverError(errorMessage);
        }
    }
}