// Interfaces e tipos — só importados como tipo, não executam nada no runtime
import type { IEnderecoRespository } from "../../../application/ports/respositories/IEnderecoRepository";
import type { Cep } from "../../../domain/entities/endereco/Cep";
import type { Endereco as PrismaEnderecoRow } from "../generated/prisma/client";
import type { Either } from "../../../shared/Either";
import type { DomainError } from "../../../domain/errors/DomainError";

// Value Objects do domínio — não dependem de banco, podem ser importados normalmente
import { Endereco } from "../../../domain/entities/endereco/Endereco";
import { EnderecoId } from "../../../domain/entities/endereco/EnderecoId";
import { Cep as CepVO } from "../../../domain/entities/endereco/Cep";
import { Logradouro } from "../../../domain/entities/endereco/Logradouro";
import { Complemento } from "../../../domain/entities/endereco/Complemento";
import { Numero } from "../../../domain/entities/endereco/Numero";
import { Data } from "../../../shared/value-objects/Data";

// Erro específico para dados corrompidos no banco
export class PrismaEnderecoRepositoryDataCorruptionError extends Error {
    constructor(campo: string, motivo: string) {
        super(`Dado corrompido no banco ao reconstituir Endereco (${campo}): ${motivo}`);
        this.name = "PrismaEnderecoRepositoryDataCorruptionError";
    }
}

// Erro de domínio quando o CEP não existe no banco
export class EnderecoNaoEncontradoError extends Error {
    constructor(cep: string) {
        super(`Endereço com CEP "${cep}" não encontrado.`);
        this.name = "EnderecoNaoEncontradoError";
    }
}

export class PrismaEnderecoRepository implements IEnderecoRespository {

    async add(endereco: Endereco): Promise<void> {
        // Import lazy — o Db.ts só é carregado quando esse método é chamado,
        // nunca no momento em que o módulo é importado
        const { prisma } = await import("../../adapters/db");
        await prisma.endereco.create({
            data: {
                id: endereco.id.value,
                cep: endereco.cep.value,
                numero: endereco.numero.value,
                logradouro: endereco.logradouro ? endereco.logradouro.value : null,
                complemento: endereco.complemento ? endereco.complemento.value : null,
            },
        });
    }

    async exists(cep: Cep): Promise<boolean> {
        const { prisma } = await import("../../adapters/db");
        const count = await prisma.endereco.count({
            where: { cep: cep.value },
        });
        return count > 0;
    }

    async findEnderecoByCep(cep: Cep): Promise<Endereco> {
        const { prisma } = await import("../../adapters/db");
        const row = await prisma.endereco.findUnique({
            where: { cep: cep.value },
        });
        if (!row) {
            throw new EnderecoNaoEncontradoError(cep.value);
        }
        return this.toDomainEntity(row);
    }

    async findAllEnderecos(): Promise<Endereco[]> {
        const { prisma } = await import("../../adapters/db");
        const rows = await prisma.endereco.findMany();
        return rows.map((row) => this.toDomainEntity(row));
    }

    // Reconstitui a entidade de domínio a partir de uma linha do banco
    private toDomainEntity(row: PrismaEnderecoRow): Endereco {
        const id = this.unwrap(EnderecoId.reconstitute(row.id), "id");
        const cep = this.unwrap(CepVO.create(row.cep), "cep");
        const numero = this.unwrap(Numero.create(row.numero), "numero");
        const logradouro = row.logradouro
            ? this.unwrap(Logradouro.create(row.logradouro), "logradouro")
            : undefined;
        const complemento = row.complemento
            ? this.unwrap(Complemento.create(row.complemento), "complemento")
            : undefined;
        const criadoEm = this.unwrap(Data.create(row.criadoEm), "criadoEm");
        const atualizadoEm = this.unwrap(Data.create(row.atualizadoEm), "atualizadoEm");

        return Endereco.reconstitute(
            { cep, numero, logradouro, complemento },
            id,
            criadoEm,
            atualizadoEm
        );
    }

    // Se o dado veio do banco e não reconstitui, é corrupção — lança erro de infra (500)
    private unwrap<R>(result: Either<DomainError, R>, campo: string): R {
        if (result.isSuccess()) return result.value;
        throw new PrismaEnderecoRepositoryDataCorruptionError(campo, result.value.message);
    }
}