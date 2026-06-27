import type { Router } from "express";
import { makeRegisterIdentidadeController } from "../factories/MakeRegisterIdentidadeController";
import { makeRegisterEnderecoController } from "../factories/MakeRegisterEnderecoController";
import { makeFindIdentidadeController } from "../factories/MakeFindIdentidadeController";
import { makeFindEnderecoController } from "../factories/MakeFindEnderecoController";
import { makeGetUsuarioByCpfController } from "../factories/MakeGetUsuarioByCpfController";
import { makeListarPacientesController, makeMudarStatusController } from "../factories/MakeModeracaoControllers";
import { makeGetPerfilPacienteController } from "../factories/MakeGetPerfilPacienteController";
import { adaptRoute } from "../../infra/adapters/ExpressRouterAdapater";

export const setupRegisterRoutes = (router: Router): void => {
    const registerIdentidadeController = makeRegisterIdentidadeController();
    const registerEnderecoController = makeRegisterEnderecoController();
    const findIdentidadeController = makeFindIdentidadeController();
    const findEnderecoController = makeFindEnderecoController();
    const getUsuarioByCpfController = makeGetUsuarioByCpfController();
    const listarPacientesController = makeListarPacientesController();
    const mudarStatusController = makeMudarStatusController();
    const getPerfilPacienteController = makeGetPerfilPacienteController();

    router.post("/identidades", adaptRoute(registerIdentidadeController));
    router.get("/identidades/:cpf", adaptRoute(findIdentidadeController));

    router.post("/enderecos", adaptRoute(registerEnderecoController));
    router.get("/enderecos/:cep", adaptRoute(findEnderecoController));

    // Rota de integração com o serviço auth
    router.get("/usuarios/:cpf", adaptRoute(getUsuarioByCpfController));

    // Rotas de moderação (Fase 3)
    router.get("/pacientes", adaptRoute(listarPacientesController));
    router.patch("/pacientes/:cpf/status", adaptRoute(mudarStatusController));

    // Rota para obter o perfil do paciente (Fase 4)
    router.get("/pacientes/:cpf/perfil", adaptRoute(getPerfilPacienteController));
};