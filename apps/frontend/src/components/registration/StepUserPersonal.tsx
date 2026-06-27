import { useRegistrationStore } from "@/store/registrationStore";
import { formatCPF, formatPhone, formatDate } from "@/lib/masks";
import { validateCPF, validateDate } from "@/lib/validation";
import { FileText, Phone, ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";
import StepPatientAddress from "./StepPatientAddress";

interface Props {
  onNext: () => void;
  onBack: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const StepUserPersonal = ({
  onNext,
  onBack,
  stepNumber,
  totalSteps,
}: Props) => {
  const { patientData, updatePatientData } = useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const digits = (patientData.telefone || "").replace(/\D/g, "");
    const notDdd = ["20", "23", "25", "26", "29",
                    "30", "36", "39", "40", "50",
                    "52", "56", "57", "58", "59",
                    "60", "70", "72", "78", "80", "90"];

    if (!patientData.cpf || !validateCPF(patientData.cpf))
      e.cpf = "Por favor, informe um CPF válido.";

    if (!patientData.dataNascimento || !validateDate(patientData.dataNascimento))
      e.dataNascimento = "Por favor, informe uma data válida.";

    if (!patientData.cep || patientData.cep.replace(/\D/g, '').length < 8)
      e.cep = 'Por favor, informe um CEP válido.';
    if (!patientData.numero?.trim())
      e.numero = 'Por favor, informe o número.';

    if (digits.length < 11)
      e.phone = "Por favor, informe um telefone válido.";
    else if (notDdd.includes(digits.substring(0, 2)))
      e.phone = "Por favor, informe um DDD válido.";
    else if (digits[2] !== "9")
      e.phone = "Por favor, verifique a presença do dígito 9.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <>
      <div className="step-header">
        <div className="icon-hero">
          <FileText size={22} className="md:hidden" />
          <FileText size={26} className="hidden md:block" />
        </div>
        <h2>{patientData.primeiroNome}, informe alguns dados</h2>
        <p>
          Serão necessários para manter-se conectad
          {patientData.pronomes[0] === "Ele/Dele"
            ? "o"
            : patientData.pronomes[0] === "Ela/Dela"
              ? "a"
              : "e"}{" "}
          conosco
        </p>
        {stepNumber && totalSteps && (
          <div className="step-badge">
            Etapa {stepNumber} de {totalSteps}
          </div>
        )}
      </div>

      <div className="step-divider" />

      <div className="space-y-4 md:space-y-5">
        {/* CPF */}
        <div>
          <div>
            <label className="label-cadus">CPF *</label>
            <input
              className="input-cadus"
              value={patientData.cpf || ""}
              onChange={(e) =>
                updatePatientData({ cpf: formatCPF(e.target.value) })
              }
              placeholder="000.000.000-00"
              inputMode="numeric"
            />
          </div>
          {errors.cpf && <p className="error-text">{errors.cpf}</p>}
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="label-cadus">Data de nascimento *</label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              type="text"
              className="input-cadus pl-12"
              placeholder="dd/mm/yyyy"
              value={patientData.dataNascimento || ""}
              onChange={(e) =>
                updatePatientData({
                  dataNascimento: formatDate(e.target.value),
                })
              }
            />
          </div>
          {errors.dataNascimento && (
            <p className="error-text mt-2">{errors.dataNascimento}</p>
          )}
        </div>

        {/* Endereço */}
        <StepPatientAddress errors={errors} />

        {/* Telefone */}
        <div>
          <label className="label-cadus">Número de telefone *</label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              className="input-cadus pl-12"
              value={patientData.telefone || ""}
              onChange={(e) =>
                updatePatientData({ telefone: formatPhone(e.target.value) })
              }
              placeholder="(00) 90000-0000"
              inputMode="tel"
            />
          </div>
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
      </div>

      <button
        onClick={() => {
          if (validate()) onNext();
        }}
        className="btn-primary w-full mt-4 md:mt-8 group"
      >
        Continuar
      </button>

      <button onClick={onBack} className="btn-back">
        <ArrowLeft size={16} /> Voltar
      </button>
    </>
  );
};

export default StepUserPersonal;