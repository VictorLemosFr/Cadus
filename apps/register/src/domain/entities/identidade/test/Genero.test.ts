import { describe, expect, test } from "vitest";
import { Genero } from "../Genero";
import { GeneroEnum } from "../enums/GeneroEnum";

describe('GeneroVO', () => {
    
    describe('CENÁRIOS DE SUCESSO', () => {
        test('deve retornar true para uma opção de gênero listada', () => {
            const resultado = Genero.noFormatGeneroError(GeneroEnum.NAO_INFORMADO);
            expect(resultado).toBe(true);
        });
    });
}); 