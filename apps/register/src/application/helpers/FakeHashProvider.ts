
import type { HashProvider } from "../../infra/providers/HashProvider";


export class FakeHashProvider implements HashProvider {
    private readonly PREFIX = "$fake$hash$";

    async hash(plainText: string): Promise<string> {
        // Garante exatamente 60 caracteres, preenchendo com um padrão
        // derivado do texto original (não criptograficamente seguro).
        const base = `${this.PREFIX}${plainText}`;
        return base.padEnd(60, "0").slice(0, 60);
    }

    async compare(plainText: string, hash: string): Promise<boolean> {
        const expectedHash = await this.hash(plainText);
        return expectedHash === hash;
    }
}