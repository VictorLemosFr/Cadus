import type { IIdentidadeRepository } from "../../../application/ports/respositories/IIdentidadeRepository.ts";
import type { Cpf } from "../../../domain/entities/identidade/Cpf.ts";
import type { Email } from "../../../domain/entities/identidade/Email.ts";
import type {
    Identidade as PrismaIdentidadeRow,
    Genero as PrismaGenero,
    Pronome as PrismaPronome,
} from "../generated/prisma/client.ts";
import type { Either } from "../../../shared/Either.ts";
import type { DomainError } from "../../../domain/errors/DomainError.ts";

import { IdentidadeId } from "../../../domain/entities/identidade/IdentidadeId.ts";
import { EnderecoId } from "../../../domain/entities/endereco/EnderecoId.ts";
import { Nome } from "../../../domain/entities/identidade/Nome.ts";
import { Cpf as CpfVO } from "../../../domain/entities/identidade/Cpf.ts";
import { Data } from "../../../shared/value-objects/Data.ts";
import { Email as EmailVO } from "../../../domain/entities/identidade/Email.ts";
import { Genero } from "../../../domain/entities/identidade/Genero.ts";
import { Pronome } from "../../../domain/entities/identidade/Pronome.ts";
import { Senha } from "../../../domain/entities/identidade/Senha.ts";
import { Telefone } from "../../../domain/entities/identidade/Telefone.ts";
import { Identidade } from "../../../domain/entities/identidade/Identidade.ts";

export class PrismaIdentidadeRepositoryDataCorruptionError extends Error {
    constructor(campo: string, motivo: string) {
        super(`Dado corrompido no banco ao reconstituir Identidade (${campo}): ${motivo}`);
        this.name = "PrismaIdentidadeRepositoryDataCorruptionError";
    }
}

export class PrismaIdentidadeRepository implements IIdentidadeRepository {

    async add(identidade: Identidade): Promise<void> {
        const { prisma } = await import("../../adapters/db.ts");
        await prisma.identidade.create({
            data: {
                id: identidade.IdentidadeId.value,
                nome: identidade.nome.value,
                cpf: identidade.cpf.value,
                dataNascimento: identidade.dataNascimento.value,
                genero: this.toPrismaGenero(identidade.genero.value),
                pronome: identidade.pronome
                    ? this.toPrismaPronome(identidade.pronome.value)
                    : null,
                email: identidade.email.value,
                telefone: identidade.telefone.value,
                senha: identidade.senha.value,
                enderecoId: identidade.endereco.value,
                // queixa pode ser undefined — o banco aceita null
                queixa: identidade.queixa ?? null,
            },
        });
    }

    async exists(cpf: Cpf): Promise<boolean> {
        const { prisma } = await import("../../adapters/db.ts");
        const count = await prisma.identidade.count({ where: { cpf: cpf.value } });
        return count > 0;
    }

    async findIdentidadeByCpf(cpf: Cpf): Promise<Identidade | null> {
        const { prisma } = await import("../../adapters/db.ts");
        const row = await prisma.identidade.findUnique({ where: { cpf: cpf.value } });
        if (!row) return null;
        return this.toDomainEntity(row);
    }

    async findIdentidadeByEmail(email: Email): Promise<Identidade | null> {
        const { prisma } = await import("../../adapters/db.ts");
        const row = await prisma.identidade.findUnique({ where: { email: email.value } });
        if (!row) return null;
        return this.toDomainEntity(row);
    }

    async findAllIdentidades(): Promise<Identidade[] | null> {
        const { prisma } = await import("../../adapters/db.ts");
        const rows = await prisma.identidade.findMany();
        if (rows.length === 0) return null;
        return rows.map((row) => this.toDomainEntity(row));
    }

    async findByStatus(status: string): Promise<Identidade[]> {
        const { prisma } = await import("../../adapters/db.ts");
        const rows = await prisma.identidade.findMany({
            where: { status: status as any, deletadoEm: null },
            orderBy: { criadoEm: "asc" },
        });
        return rows.map((row) => this.toDomainEntity(row));
    }

    async updateStatus(cpf: Cpf, novoStatus: string): Promise<void> {
        const { prisma } = await import("../../adapters/db.ts");
        await prisma.identidade.update({
            where: { cpf: cpf.value },
            data: { status: novoStatus as any },
        });
    }

    private toPrismaGenero(value: string): PrismaGenero {
        return value.toUpperCase() as PrismaGenero;
    }

    private toPrismaPronome(value: string): PrismaPronome {
        return value.toUpperCase() as PrismaPronome;
    }

    private toDomainEntity(row: PrismaIdentidadeRow): Identidade {
        const id = this.unwrap(IdentidadeId.create(row.id), "id");
        const nome = this.unwrap(Nome.create(row.nome), "nome");
        const cpf = this.unwrap(CpfVO.create(row.cpf), "cpf");
        const dataNascimento = this.unwrap(Data.create(row.dataNascimento), "dataNascimento");
        const genero = this.unwrap(Genero.create(row.genero), "genero");
        const pronome = row.pronome
            ? this.unwrap(Pronome.create(row.pronome), "pronome")
            : undefined;
        const email = this.unwrap(EmailVO.create(row.email), "email");
        const telefone = this.unwrap(Telefone.create(row.telefone), "telefone");
        const senha = this.unwrap(Senha.create(row.senha), "senha");
        const enderecoId = this.unwrap(EnderecoId.reconstitute(row.enderecoId), "enderecoId");
        const criadoEm = this.unwrap(Data.create(row.criadoEm), "criadoEm");
        const atualizadoEm = this.unwrap(Data.create(row.atualizadoEm), "atualizadoEm");
        const deletadoEm = row.deletadoEm
            ? this.unwrap(Data.create(row.deletadoEm), "deletadoEm")
            : undefined;

        return Identidade.reconstitute(
            { nome, cpf, dataNascimento, genero, pronome, email, telefone, senha, enderecoId, queixa: row.queixa ?? undefined, status: row.status ?? undefined },
            id,
            criadoEm,
            atualizadoEm,
            deletadoEm
        );
    }

    private unwrap<R>(result: Either<DomainError, R>, campo: string): R {
        if (result.isSuccess()) return result.value;
        throw new PrismaIdentidadeRepositoryDataCorruptionError(campo, result.value.message);
    }
}