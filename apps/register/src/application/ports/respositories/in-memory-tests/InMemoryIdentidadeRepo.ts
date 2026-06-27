import type { Cpf } from "../../../../domain/entities/identidade/Cpf";
import type { Email } from "../../../../domain/entities/identidade/Email";
import type { Identidade } from "../../../../domain/entities/identidade/Identidade";
import type { IIdentidadeRepository } from "../IIdentidadeRepository";

export class InMemoryIdentidadeRepo implements IIdentidadeRepository {
    private readonly identidades: Identidade[] = [];

    constructor(identidades: Identidade[] = []) {
        this.identidades = identidades;
    }

    async add(identidade: Identidade): Promise<void> {
        const existsIdentidade = await this.exists(identidade.cpf);
        if (!existsIdentidade) {
            this.identidades.push(identidade);
        }
    }

    async exists(cpf: Cpf): Promise<boolean> {
        return (await this.findIdentidadeByCpf(cpf)) !== null;
    }

    async findIdentidadeByCpf(cpf: Cpf): Promise<Identidade | null> {
        for (const identidade of this.identidades) {
            if (identidade.cpf.value === cpf.value) {
                return identidade;
            }
        }
        return null;
    }

    async findIdentidadeByEmail(email: Email): Promise<Identidade | null> {
        for (const identidade of this.identidades) {
            if (identidade.email.value === email.value) {
                return identidade;
            }
        }
        return null;
    }

    async findAllIdentidades(): Promise<Identidade[] | null> {
        if (this.identidades.length === 0) {
            return null;
        }
        return this.identidades;
    }
}