import { useRegistrationStore } from "@/store/registrationStore";
import { registerApi } from "@/lib/api";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface Props {
  onValidate: () => boolean;
  onNext: () => void;
  emailProp: string;
  senhaProp: string;
}

// Os steps guardam rótulos em PT-BR; o backend espera os enums do domínio.
const GENERO_MAP: Record<string, string> = {
  Homem: "MASCULINO",
  Mulher: "FEMININO",
  "Prefiro não informar": "NAO_INFORMADO",
};

const PRONOME_MAP: Record<string, string> = {
  "Ele/Dele": "ELE_DELE",
  "Ela/Dela": "ELA_DELA",
  "Elu/Delu": "ELU_DELU",
};

const RegisterButton = ({ onValidate, onNext, emailProp, senhaProp }: Props) => {
  const { role, updatePatientData, completeRegistration } = useRegistrationStore();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!onValidate()) return;

    setSubmitError(null);
    setLoading(true);

    try {
      if (role === "paciente") {
        // Garante email/senha no patientData antes de ler o estado fresco.
        updatePatientData({ email: emailProp, senha: senhaProp });
        const p = useRegistrationStore.getState().patientData;

        const generoEnum = GENERO_MAP[p.genero ?? ""] ?? "OUTRO";
        const pronomeRaw = p.pronomes?.[0];
        const pronomeEnum = pronomeRaw ? PRONOME_MAP[pronomeRaw] ?? "OUTRO" : undefined;

        // Um único POST: o /identidades já cria o endereço internamente.
        await registerApi.post(
          "/identidades",
          {
            nome: p.nome,
            cpf: p.cpf,
            dataNascimento: p.dataNascimento,
            genero: generoEnum,
            pronome: pronomeEnum,
            email: p.email,
            telefone: p.telefone,
            senha: p.senha,
            queixa: p.queixa || undefined,
            endereco: {
              cep: p.cep,
              logradouro: p.rua,
              numero: Number(p.numero),
              complemento: p.complemento || undefined,
            },
          },
          { public: true }
        );
      }

      completeRegistration();
      onNext();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Não foi possível concluir o cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-4 md:mt-8 group">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Criando seu cadastro...
          </>
        ) : (
          <>
            <ShieldCheck size={18} /> Criar minha conta
          </>
        )}
      </button>
      {submitError && <p className="error-text mt-2 text-center">{submitError}</p>}
    </>
  );
};

export default RegisterButton;