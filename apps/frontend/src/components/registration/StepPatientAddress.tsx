import { useState, useCallback } from 'react';
import { useRegistrationStore } from '@/store/registrationStore';
import { formatCEP, fetchAddress } from '@/lib/masks';
import { MapPin, Loader2 } from 'lucide-react';

interface Props { errors: Record<string, string>; }

const StepPatientAddress = ({ errors }: Props) => {
  const { patientData, updatePatientData } = useRegistrationStore();
  const [loadingCep, setLoadingCep] = useState(false);

  const cepFilled = !!(patientData.rua && patientData.cidade);

  const handleCep = useCallback(async (value: string) => {
    const formatted = formatCEP(value);
    updatePatientData({ cep: formatted });

    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      setLoadingCep(true);
      const addr = await fetchAddress(digits);
      if (addr) updatePatientData(addr);
      setLoadingCep(false);
    }

  }, [updatePatientData]);

  return (
    <>
      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="label-cadus">CEP *</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              className="input-cadus pl-12"
              value={patientData.cep || ''}
              onChange={(e) => handleCep(e.target.value)}
              placeholder="00000-000"
              inputMode="numeric"
              autoFocus
            />
            {loadingCep && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
          </div>
          <p className='text-[12px] md:text-xs text-muted-foreground/70'>Endereço preenchido automaticamente a partir do CEP</p>
          {errors.cep && <p className="error-text">{errors.cep}</p>}
        </div>

        {cepFilled && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3 md:space-y-4">
            <div className="info-note">
              <p className="font-500 text-foreground">{patientData.rua}</p>
              <p className="text-muted-foreground mt-0.5">{patientData.bairro} — {patientData.cidade}/{patientData.estado}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 md:gap-3">
              <div>
                <label className="label-cadus">Número *</label>
                <input className="input-cadus" value={patientData.numero || ''} onChange={(e) => updatePatientData({ numero: e.target.value })} placeholder="Nº" />
                {errors.numero && <p className="error-text">{errors.numero}</p>}
              </div>
              <div>
                <label className="label-cadus">Complemento (opcional)</label>
                <input className="input-cadus" value={patientData.complemento || ''} onChange={(e) => updatePatientData({ complemento: e.target.value })} placeholder="Apto, bloco..." />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StepPatientAddress;
