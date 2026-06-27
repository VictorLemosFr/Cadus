import { describe, it, expect, beforeEach } from "vitest";
import { useRegistrationStore } from "@/store/registrationStore";

beforeEach(() => {
  useRegistrationStore.getState().reset();
});

describe("registrationStore", () => {
  it("começa com role null e step 1", () => {
    const state = useRegistrationStore.getState();
    expect(state.role).toBeNull();
    expect(state.currentStep).toBe(1);
  });

  it("define o papel do usuário corretamente", () => {
    useRegistrationStore.getState().setRole("paciente");
    expect(useRegistrationStore.getState().role).toBe("paciente");
  });

  it("define o papel como profissional", () => {
    useRegistrationStore.getState().setRole("profissional");
    expect(useRegistrationStore.getState().role).toBe("profissional");
  });

  it("avança o step corretamente", () => {
    useRegistrationStore.getState().setCurrentStep(3);
    expect(useRegistrationStore.getState().currentStep).toBe(3);
  });

  it("atualiza dados do paciente sem sobrescrever campos anteriores", () => {
    const store = useRegistrationStore.getState();
    store.updatePatientData({ nome: "Maria" });
    store.updatePatientData({ cpf: "529.982.247-25" });
    const { patientData } = useRegistrationStore.getState();
    expect(patientData.nome).toBe("Maria");
    expect(patientData.cpf).toBe("529.982.247-25");
  });

  it("atualiza dados do profissional corretamente", () => {
    useRegistrationStore.getState().updateProfessionalData({ nome: "Dr. João", especialidade: "Fonoaudiologia" });
    const { professionalData } = useRegistrationStore.getState();
    expect(professionalData.nome).toBe("Dr. João");
    expect(professionalData.especialidade).toBe("Fonoaudiologia");
  });

  it("completeRegistration marca isRegistered como true", () => {
    useRegistrationStore.getState().setRole("paciente");
    useRegistrationStore.getState().completeRegistration();
    const state = useRegistrationStore.getState();
    expect(state.isRegistered).toBe(true);
    expect(state.registeredRole).toBe("paciente");
  });

  it("reset volta tudo para o estado inicial", () => {
    const store = useRegistrationStore.getState();
    store.setRole("profissional");
    store.setCurrentStep(5);
    store.updatePatientData({ nome: "Teste" });
    store.reset();
    const state = useRegistrationStore.getState();
    expect(state.role).toBeNull();
    expect(state.currentStep).toBe(1);
    expect(state.patientData).toEqual({});
    expect(state.isRegistered).toBe(false);
  });
});
