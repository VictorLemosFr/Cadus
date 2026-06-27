import { describe, it, expect } from "vitest";
import {
  formatCPF,
  formatPhone,
  formatCEP,
  formatName,
  getFirstName,
} from "@/lib/masks";
import { validateCPF } from '@/lib/validation'

describe("formatCPF", () => {
  it("formata CPF completo com pontos e traço", () => {
    expect(formatCPF("12345678900")).toBe("123.456.789-00");
  });

  it("formata CPF parcial (só 6 dígitos)", () => {
    expect(formatCPF("123456")).toBe("123.456");
  });

  it("remove letras e caracteres especiais antes de formatar", () => {
    expect(formatCPF("123.456.789-00")).toBe("123.456.789-00");
  });

  it("retorna vazio para entrada vazia", () => {
    expect(formatCPF("")).toBe("");
  });
});

describe("formatPhone", () => {
  it("formata celular com 11 dígitos corretamente", () => {
    expect(formatPhone("81998765432")).toBe("(81) 99876-5432");
  });

  it("formata telefone fixo com 10 dígitos (trata como celular de 9 dígitos)", () => {
    expect(formatPhone("8133334444")).toBe("(81) 33334-444");
  });

  it("retorna apenas DDD para 3 dígitos", () => {
    expect(formatPhone("819")).toBe("(81) 9");
  });

  it("remove caracteres não numéricos antes de formatar", () => {
    expect(formatPhone("(81) 99876-5432")).toBe("(81) 99876-5432");
  });
});

describe("formatCEP", () => {
  it("formata CEP completo com hífen", () => {
    expect(formatCEP("50000000")).toBe("50000-000");
  });

  it("retorna sem hífen para CEP incompleto", () => {
    expect(formatCEP("5000")).toBe("5000");
  });
});

describe("validateCPF", () => {
  it("valida CPF matematicamente correto", () => {
    expect(validateCPF("529.982.247-25")).toBe(true);
  });

  it("rejeita CPF com todos os dígitos iguais", () => {
    expect(validateCPF("111.111.111-11")).toBe(false);
  });

  it("rejeita CPF com tamanho incorreto", () => {
    expect(validateCPF("123.456")).toBe(false);
  });

  it("rejeita CPF com dígito verificador errado", () => {
    expect(validateCPF("123.456.789-99")).toBe(false);
  });
});

describe("formatName", () => {
  it("capitaliza primeira letra de cada palavra", () => {
    expect(formatName("maria das graças")).toBe("Maria Das Graças");
  });

  it("mantém espaços múltiplos entre palavras", () => {
    const result = formatName("JOÃO  SILVA");
    expect(result).toContain("João");
    expect(result).toContain("Silva");
  });
});

describe("getFirstName", () => {
  it("retorna apenas o primeiro nome formatado", () => {
    expect(getFirstName("maria das graças silva")).toBe("Maria");
  });

  it("lida com nome de uma só palavra", () => {
    expect(getFirstName("ana")).toBe("Ana");
  });

  it("retorna vazio para string vazia", () => {
    expect(getFirstName("")).toBe("");
  });
});
