import { useState } from 'react';
import { useRegistrationStore } from '@/store/registrationStore';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { validateText } from '@/lib/validation';

interface Props { onNext: () => void; onBack: () => void; stepNumber?: number; totalSteps?: number; }

const StepPatientComplaint = ({ onNext, onBack, stepNumber, totalSteps }: Props) => {
  const { patientData, updatePatientData } = useRegistrationStore();
  const [error, setError] = useState('');
  const charCount = patientData.queixa?.length || 0;

  const validate = () => {
    setError(validateText(patientData.queixa));
    return error === '';
  };

  return (
    <>
      <div className="step-header">
        <div className="icon-hero">
          <MessageCircle size={22} className="md:hidden" />
          <MessageCircle size={26} className="hidden md:block" />
        </div>
        <h2>{patientData.primeiroNome}, por que busca atendimento?</h2>
        <p>Ajuda o profissional a se preparar para você</p>
        {stepNumber && totalSteps && (
          <div className="step-badge">Etapa {stepNumber} de {totalSteps}</div>
        )}
      </div>

      <div className="step-divider" />

      <div>
        <textarea
          className="input-cadus min-h-[120px] md:min-h-[140px] resize-none"
          value={patientData.queixa || ''}
          onChange={(e) => updatePatientData({ queixa: e.target.value })}
          placeholder="Descreva aqui sua queixa principal (pelo menos 10 caracteres)..."
          maxLength={2000}
          rows={5}
        />
        <div className="flex justify-between mt-2">
          <p className="text-[11px] md:text-xs text-muted-foreground/50">Escreva com suas palavras, sem termos técnicos.</p>
          <span
            className={`text-[11px] md:text-xs ${charCount === 2000 ? "text-destructive" : "text-muted-foreground/40"}`}>
            {charCount}/2000
          </span>
        </div>
        {error && <p className="error-text mt-2">{error}</p>}
      </div>

      <button
        onClick={() => {if(validate()) onNext()}}
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

export default StepPatientComplaint;
