import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validateLogin,
  validatePatientRegistration,
} from "@/lib/validation";

// ─── validateEmail ────────────────────────────────────────────────────────────

describe("validateEmail", () => {
  it("valida email correto", () => {
    expect(validateEmail("usuario@example.com")).toBe(true);
  });

  it("rejeita email sem @", () => {
    expect(validateEmail("usuarioexample.com")).toBe(false);
  });

  it("rejeita email sem domínio", () => {
    expect(validateEmail("usuario@")).toBe(false);
  });

  it("rejeita email vazio", () => {
    expect(validateEmail("")).toBe(false);
  });
});

// ─── validateLogin ───────────────────────────────────────────────────────────

describe("validateLogin", () => {
  it("valida login com email e senha corretos", () => {
    const result = validateLogin("usuario@example.com", "email", "senha123");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejeita login sem email", () => {
    const result = validateLogin("", "email", "senha123");
    expect(result.isValid).toBe(false);
    expect(result.errors.login).toBe("Email é obrigatório");
  });

  it("rejeita login com email inválido", () => {
    const result = validateLogin("emailinvalido", "email", "senha123");
    expect(result.isValid).toBe(false);
    expect(result.errors.login).toBe("Email inválido");
  });

  it("rejeita login sem senha", () => {
    const result = validateLogin("usuario@example.com", "email", "");
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("Senha é obrigatória");
  });

  it("rejeita login com senha muito curta", () => {
    const result = validateLogin("usuario@example.com", "email", "abc");
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("Senha deve ter no mínimo 6 caracteres");
  });
});

// ─── validatePatientRegistration ──────────────────────────────────────────────

describe("validatePatientRegistration", () => {
  it("valida cadastro de paciente completo", () => {
    const result = validatePatientRegistration({
      nome: "Maria Silva",
      cpf: "52998224725",
      email: "maria@example.com",
      telefone: "81998765432",
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejeita cadastro sem nome", () => {
    const result = validatePatientRegistration({
      cpf: "52998224725",
      email: "maria@example.com",
      telefone: "81998765432",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.nome).toBe("Nome é obrigatório");
  });

  it("rejeita cadastro com CPF inválido", () => {
    const result = validatePatientRegistration({
      nome: "Maria Silva",
      cpf: "123",
      email: "maria@example.com",
      telefone: "81998765432",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.cpf).toBe("CPF deve ter 11 dígitos");
  });

  it("rejeita cadastro com email inválido", () => {
    const result = validatePatientRegistration({
      nome: "Maria Silva",
      cpf: "52998224725",
      email: "emailinvalido",
      telefone: "81998765432",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Email inválido");
  });

  it("rejeita cadastro com telefone incompleto", () => {
    const result = validatePatientRegistration({
      nome: "Maria Silva",
      cpf: "52998224725",
      email: "maria@example.com",
      telefone: "1234",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.telefone).toBe("Telefone inválido");
  });
});