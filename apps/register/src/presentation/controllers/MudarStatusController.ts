import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import { ok, badRequest, notFound, serverError } from "./helpers/HttpHelper";
import type { MudarStatusPaciente } from "../../application/usecases/mudar-status/MudarStatusPaciente";

export class MudarStatusController implements BaseController {
    private readonly mudarStatusUC: MudarStatusPaciente;

    constructor(mudarStatusUC: MudarStatusPaciente) {
        this.mudarStatusUC = mudarStatusUC;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const cpf = req.params?.cpf;
            const novoStatus = req.body?.status;

            if (!cpf) {
                return badRequest(new Error("Parâmetro 'cpf' é obrigatório"));
            }
            if (!novoStatus || typeof novoStatus !== "string") {
                return badRequest(new Error("Campo 'status' é obrigatório no corpo"));
            }

            const result = await this.mudarStatusUC.execute(cpf, novoStatus);

            if (result.isError()) {
                const msg = result.value.message;
                if (msg.includes("não encontrado")) {
                    return notFound(result.value);
                }
                return badRequest(result.value);
            }

            return ok({ cpf, status: novoStatus, mensagem: "Status atualizado" });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido";
            return serverError(msg);
        }
    }
}