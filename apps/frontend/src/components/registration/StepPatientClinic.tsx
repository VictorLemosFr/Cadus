import { useState } from "react";
import { useRegistrationStore } from "@/store/registrationStore";
import { Cross, ArrowRight, ArrowLeft, Check, CreditCard } from "lucide-react";
import { validateText } from "@/lib/validation";
import NameInput from "../NameInput";

interface Props {
  onNext: () => void;
  onBack: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const comoChegouOptions = [
  "Encaminhado pelo SUS",
  "Indicação médica",
  "Vim por conta própria",
  "Outro",
];

const StepPatientClinic = ({
  onNext,
  onBack,
  stepNumber,
  totalSteps,
}: Props) => {
  const { patientData, updatePatientData } = useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [outroComoChegou, setOutroComoChegou] = useState("");

  const selectedOpt = patientData.comoChegou || "";

  const validate = () => {
    const e: Record<string, string> = {};

    if (
      !patientData.comoChegou ||
      (patientData.comoChegou === "Outro" && !outroComoChegou)
    )
      e.comoChegou = "Por favor, informe como chegou até nós.";

    if (patientData.comoChegou === "Outro" && outroComoChegou) {
      const erroTexto = validateText(outroComoChegou);
      if (erroTexto !== "") {
        e.outroComoChegou = erroTexto;
        e.comoChegou = "";
      }
    }

    if (
      patientData.temResponsavel &&
      (!patientData.nomeResponsavel.trim() ||
        patientData.nomeResponsavel.split(" ").length < 2)
    )
      e.nomeResponsavel = "Por favor, insira o nome completo do responsável.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (patientData.comoChegou === "Outro") {
      updatePatientData({ comoChegou: outroComoChegou });
    }
    onNext();
  };

  return (
    <>
      <div className="step-header">
        <div className="icon-hero">
          <Cross size={22} className="md:hidden" />
          <Cross size={26} className="hidden md:block" />
        </div>
        <h2>Informações clínicas</h2>
        <p>Inclui opções para pacientes do SUS</p>
        {stepNumber && totalSteps && (
          <div className="step-badge">
            Etapa {stepNumber} de {totalSteps}
          </div>
        )}
      </div>

      <div className="step-divider" />

      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="label-cadus">Como chegou até nós? *</label>
          <div className="flex flex-col gap-2.5 md:gap-3">
            {comoChegouOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updatePatientData({ comoChegou: opt })}
                className={`selection-card text-[13px] md:text-sm !py-2.5 md:!py-3 ${patientData.comoChegou === opt ? "selection-card-active" : ""}`}
              >
                {patientData.comoChegou === opt && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check size={10} className="text-primary-foreground" />
                  </div>
                )}
                {opt}
              </button>
            ))}
          </div>
          {selectedOpt === "Outro" && (
            <input
              className="input-cadus mt-2"
              value={outroComoChegou}
              onChange={(e) => setOutroComoChegou(e.target.value)}
              placeholder="Descreva aqui..."
            />
          )}
          {errors.comoChegou && (
            <p className="error-text">{errors.comoChegou}</p>
          )}
          {errors.outroComoChegou && (
            <p className="error-text">{errors.outroComoChegou}</p>
          )}
        </div>

        <div>
          <label className="label-cadus">Cartão SUS (opcional)</label>
          <div className="relative">
            <CreditCard
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              className="input-cadus pl-12"
              value={patientData.cartaoSus || ""}
              onChange={(e) =>
                updatePatientData({
                  cartaoSus: e.target.value.replace(/\D/g, "").slice(0, 15),
                })
              }
              placeholder="Número do Cartão SUS"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className="label-cadus flex items-center gap-3">
            <input
              type="checkbox"
              checked={patientData.temResponsavel || false}
              onChange={(e) =>
                updatePatientData({
                  temResponsavel: e.target.checked,
                  nomeResponsavel: e.target.checked
                    ? patientData.nomeResponsavel
                    : "",
                })
              }
              className="w-5 h-5 rounded-md border-2 border-border accent-primary"
            />
            <span>Possui responsável legal</span>
          </label>
        </div>

        {patientData.temResponsavel && (
          <div className="animate-in fade-in duration-200">
            <label className="label-cadus">Nome do responsável *</label>
            <NameInput
              error={errors.nomeResponsavel}
              placeholder="Nome completo..."
              value={patientData.nomeResponsavel}
              attribute="nomeResponsavel"
            />

            {/* <label className="label-cadus mt-3">Nome do responsável *</label>
            <div>
              <input
                className="input-cadus"
                placeholder="Nome do responsável"
                value={patientData.nomeResponsavel || ""}
                onChange={(e) =>
                  updatePatientData({
                    nomeResponsavel: formatName(sanitizeName(e.target.value)),
                  })
                }
              />
            </div>
            {errors.nomeResponsavel && (
              <p className="error-text">{errors.nomeResponsavel}</p>
            )} */}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
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

export default StepPatientClinic;
