import { useState } from "react";
import { validatePatientRegistration } from "@/lib/validation";
import { useRegistrationStore } from "@/store/registrationStore";
import { registerApi } from "@/lib/api";

interface RegisterEnderecoResponse {
  id: string;
}

export const usePatientRegistration = () => {
  const { updatePatientData, patientData, completeRegistration } = useRegistrationStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    updatePatientData({ [field]: value } as any);
  };

  const validateStep = (fields: string[]) => {
    const dataToValidate = fields.reduce((acc, field) => {
      acc[field] = (patientData as any)[field] || "";
      return acc;
    }, {} as any);

    const validation = validatePatientRegistration(dataToValidate);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});
    return true;
  };

  const submitRegistration = async () => {
    const validation = validatePatientRegistration(patientData as any);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Passo 1 — registra o endereço e recebe o id gerado
      // O CEP vem mascarado do front (ex: "50710-060") — o back limpa os não-numéricos
      const endereco = await registerApi.post<RegisterEnderecoResponse>(
        "/enderecos",
        {
          cep: patientData.cep,
          logradouro: patientData.rua,
          numero: Number(patientData.numero),
          complemento: patientData.complemento || undefined,
        },
        { public: true }
      );

      // Passo 2 — registra a identidade referenciando o endereço
      await registerApi.post(
        "/identidades",
        {
          nome: patientData.nome,
          cpf: patientData.cpf,
          dataNascimento: patientData.dataNascimento,
          genero: patientData.genero,
          pronome: patientData.pronomes?.[0] || undefined,
          email: patientData.email,
          telefone: patientData.telefone,
          senha: patientData.senha,
          queixa: patientData.queixa || undefined,
          // endereco aninhado conforme espera o RegisterIdentidadeController
          endereco: {
            cep: patientData.cep,
            logradouro: patientData.rua,
            numero: Number(patientData.numero),
            complemento: patientData.complemento || undefined,
          },
        },
        { public: true }
      );

      completeRegistration();
      return true;

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar";
      setErrors({ submit: message });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    patientData,
    errors,
    isLoading,
    handleFieldChange,
    validateStep,
    submitRegistration,
  };
};