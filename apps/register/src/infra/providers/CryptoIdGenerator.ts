import { randomUUID } from "node:crypto";

/**
 * Interface para gerar com id usando o crypto do bun
 */
export interface IIdGenerator {
    generate() : string;
}

export class CryptoIdGenerator implements IIdGenerator {
    generate () : string {
        return randomUUID() as string;
    }
}