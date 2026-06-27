import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePatientRegistration } from "@/hooks/usePatientRegistration";
import { useRegistrationStore } from "@/store/registrationStore";

beforeEach(() => {
  useRegistrationStore.getState().reset();
});

describe("usePatientRegistration", () => {
  it("começa sem erros", () => {
    const { result } = renderHook(() => usePatientRegistration());
    expect(result.current.errors).toEqual({});
  });

  it("atualiza dados do paciente quando campo muda", () => {
    const { result } = renderHook(() => usePatientRegistration());
    act(() => {
      result.current.handleFieldChange("nome", "Maria Silva");
    });
    expect(result.current.patientData.nome).toBe("Maria Silva");
  });

  it("valida step e retorna erros quando nome está vazio", () => {
    const { result } = renderHook(() => usePatientRegistration());
    act(() => {
      result.current.handleFieldChange("cpf", "52998224725");
    });
    
    let isValid = false;
    act(() => {
      isValid = result.current.validateStep(["nome", "cpf"]);
    });
    
    expect(isValid).toBe(false);
    expect(result.current.errors.nome).toBeDefined();
  });

  it("valida step e retorna erro para CPF inválido", () => {
    const { result } = renderHook(() => usePatientRegistration());
    act(() => {
      result.current.handleFieldChange("nome", "Maria Silva");
      result.current.handleFieldChange("cpf", "123");
    });
    
    let isValid = false;
    act(() => {
      isValid = result.current.validateStep(["nome", "cpf"]);
    });
    
    expect(isValid).toBe(false);
    expect(result.current.errors.cpf).toBeDefined();
  });

  it("submete cadastro com sucesso quando todos os campos são válidos", async () => {
    const { result } = renderHook(() => usePatientRegistration());
    act(() => {
      result.current.handleFieldChange("nome", "Maria Silva");
      result.current.handleFieldChange("cpf", "52998224725");
      result.current.handleFieldChange("email", "maria@example.com");
      result.current.handleFieldChange("telefone", "81998765432");
    });
    
    let submitResult = false;
    await act(async () => {
      submitResult = await result.current.submitRegistration();
    });
    
    expect(submitResult).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it("rejeita cadastro quando email está inválido", async () => {
    const { result } = renderHook(() => usePatientRegistration());
    act(() => {
      result.current.handleFieldChange("nome", "Maria Silva");
      result.current.handleFieldChange("cpf", "52998224725");
      result.current.handleFieldChange("email", "emailinvalido");
      result.current.handleFieldChange("telefone", "81998765432");
    });
    
    let submitResult = false;
    await act(async () => {
      submitResult = await result.current.submitRegistration();
    });
    
    expect(submitResult).toBe(false);
    expect(result.current.errors.email).toBeDefined();
  });

  it("rejeita cadastro quando telefone está incompleto", async () => {
    const { result } = renderHook(() => usePatientRegistration());
    act(() => {
      result.current.handleFieldChange("nome", "Maria Silva");
      result.current.handleFieldChange("cpf", "52998224725");
      result.current.handleFieldChange("email", "maria@example.com");
      result.current.handleFieldChange("telefone", "1234");
    });
    
    let submitResult = false;
    await act(async () => {
      submitResult = await result.current.submitRegistration();
    });
    
    expect(submitResult).toBe(false);
    expect(result.current.errors.telefone).toBeDefined();
  });
});
