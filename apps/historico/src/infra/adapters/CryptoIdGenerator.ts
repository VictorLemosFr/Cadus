import { randomUUID } from "node:crypto";
import type { IIdGenerator } from "./IdGenerator";

export class CryptoIdGenerator implements IIdGenerator {
    generate () : string {
        return randomUUID() as string;
    }
}