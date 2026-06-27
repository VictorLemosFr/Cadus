import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLoginForm } from "../hooks/useLoginForm";

describe("useLoginForm", () => {
  it("começa com campos vazios", () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.login).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.errors).toEqual({});
  });

  it("atualiza email quando digitado", () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setLogin("usuario@example.com");
      result.current.setTypeLogin("email");
    });
    expect(result.current.login).toBe("usuario@example.com");
  });

  it("atualiza cpf quando digitado", () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      // CPF válido gerado aleatoriamente
      result.current.setLogin("83830252030");
      result.current.setTypeLogin("cpf");
    });
    expect(result.current.login).toBe("83830252030");
  });

  it("atualiza senha quando digitada", () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setPassword("senha123");
    });
    expect(result.current.password).toBe("senha123");
  });

  it("valida e rejeita login com email inválido", async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setLogin("emailinvalido");
      result.current.setTypeLogin("email");
      result.current.setPassword("senha123");
    });
    
    await act(async () => {
      await result.current.handleSubmit(new Event("submit") as any);
    });
    
    expect(result.current.errors.login).toBe("E-mail inválido");
  });

  it("valida e rejeita login com cpf inválido", async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      // CPF inválido
      result.current.setLogin("123.456.789-00");
      result.current.setTypeLogin("cpf");
      result.current.setPassword("senha123");
    });
    
    await act(async () => {
      await result.current.handleSubmit(new Event("submit") as any);
    });
    
    expect(result.current.errors.login).toBe("CPF inválido");
  });

  it("limpa erros quando submissão é válida", async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setLogin("usuario@example.com");
      result.current.setTypeLogin("email");
      result.current.setPassword("senha123");
    });
    
    await act(async () => {
      await result.current.handleSubmit(new Event("submit") as any);
    });
    
    expect(result.current.errors).toEqual({});
  });
});
