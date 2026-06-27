import { useState } from "react";
import { validateLogin } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  token: string;
}

export const useLoginForm = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ cpf?: string; password?: string; submit?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { setSession } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLogin(cpf, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { token } = await authApi.post<LoginResponse>(
        "/auth/login",
        { cpf: cpf.replace(/\D/g, ""), senha: password },
        { public: true }
      );

      // Por enquanto todo login é paciente — papel vem na Fase 3
      setSession(token, cpf.replace(/\D/g, ""), "paciente");

      navigate("/paciente/inicio");

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao entrar";
      setErrors({ submit: message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cpf,
    setCpf,
    password,
    setPassword,
    errors,
    isLoading,
    handleSubmit,
  };
};