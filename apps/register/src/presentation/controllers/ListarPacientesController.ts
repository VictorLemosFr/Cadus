import type { HttpRequest, HttpResponse } from "../protocol-interfaces/Http";
import type { BaseController } from "./BaseController";
import { ok, badRequest, serverError } from "./helpers/HttpHelper";
import type { ListarPacientes } from "../../application/usecases/listar-pacientes/ListarPacientes";

export class ListarPacientesController implements BaseController {
    private readonly listarPacientesUC: ListarPacientes;

    constructor(listarPacientesUC: ListarPacientes) {
        this.listarPacientesUC = listarPacientesUC;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            // status vem da query string: GET /pacientes?status=AGUARDANDO_MODERACAO
            const status = req.query?.status;

            const pacientes = await this.listarPacientesUC.execute(status);

            // Mapeia a entidade para um JSON enxuto pra fila de moderação
            return ok(
                pacientes.map((p) => ({
                    cpf: p.cpf.value,
                    nome: p.nome.value,
                    queixa: p.queixa ?? null,
                    status: p.status ?? null,
                    criadoEm: p.criadoEm.value,
                }))
            );
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido";
            // Status inválido cai como 400
            if (msg.startsWith("Status inválido")) {
                return badRequest(new Error(msg));
            }
            return serverError(msg);
        }
    }
}