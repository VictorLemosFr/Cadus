import { useState } from "react";
import { useRegistrationStore } from "@/store/registrationStore";
import { getFirstName } from "@/lib/masks";
import { UserRound, ArrowRight, ArrowLeft } from "lucide-react";
import NameInput from "../NameInput";

interface Props {
  onNext: () => void;
  onBack: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const StepPatientName = ({ onNext, onBack, stepNumber, totalSteps }: Props) => {
  const { patientData, updatePatientData } = useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [temNomeSocial, setTemNomeSocial] = useState(false);

  const validate = () => {
    const nome = patientData.nome?.trim();
    const nomeSocial = patientData.nomeSocial?.trim();
    const e: Record<string, string> = {};

    if (temNomeSocial && (!nomeSocial || nomeSocial.split(" ").length < 2))
      e.nomeSocial = "Por favor, informe seu nome social completo.";

    if (!nome || nome.split(" ").length < 2)
      e.nome = "Por favor, informe seu nome civil completo.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      updatePatientData({
        primeiroNome: getFirstName(
          patientData.nomeSocial ? patientData.nomeSocial : patientData.nome,
        ),
      });
      onNext();
    }
  };

  return (
    <>
      <div className="step-header">
        <div className="icon-hero">
          <UserRound size={22} className="md:hidden" />
          <UserRound size={26} className="hidden md:block" />
        </div>
        <h2>Como você se chama?</h2>
        <p>Seu nome completo</p>
        {stepNumber && totalSteps && (
          <div className="step-badge">
            Etapa {stepNumber} de {totalSteps}
          </div>
        )}
      </div>

      <div className="step-divider" />

      <div className="flex flex-col gap-3">
        <label className="label-cadus flex items-center gap-3 mx-4">
          <input
            type="checkbox"
            checked={temNomeSocial}
            onChange={() => setTemNomeSocial(!temNomeSocial)}
            className="w-5 h-5 rounded-md border-2 border-border accent-primary"
          />
          <span>Tenho nome social</span>
        </label>

        {temNomeSocial && (
          <NameInput
            error={errors.nomeSocial}
            placeholder="Nome social completo..."
            value={patientData.nomeSocial}
            attribute="nomeSocial"
          />
        )}

        <div>
          <NameInput
            error={errors.nome}
            placeholder="Nome civil completo..."
            value={patientData.nome}
            attribute="nome"
          />
        </div>
      </div>

      <button
        onClick={() => {
          handleSubmit();
        }}
        className="btn-primary w-full mt-4 md:mt-8 group"
      >
        Continuar{" "}
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>

      <button onClick={onBack} className="btn-back">
        <ArrowLeft size={16} /> Voltar
      </button>
    </>
  );
};

export default StepPatientName;
