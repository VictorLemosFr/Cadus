import { useState } from "react";
import { useRegistrationStore } from "@/store/registrationStore";
import { Heart, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface Props {
  onNext: () => void;
  onBack: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const opcoesGenero = [
  "Mulher",
  "Homem",
  "Outra identidade",
  "Prefiro não informar",
];

const outrasOpcoesGenero = [
  "Não-binário",
  "Gênero flúido",
  "Bigênero",
  "Pangênero",
  "Agênero",
  "Travesti",
  "Prefiro me autodescrever",
];

const opcoesPronome = ["Ela/Dela", "Ele/Dele", "Elu/Delu", "Prefiro me autodescrever"];

const StepPatientGender = ({
  onNext,
  onBack,
  stepNumber,
  totalSteps,
}: Props) => {
  const { patientData, updatePatientData } = useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [outroGenero, setOutroGenero] = useState("");
  const [autodescGenero, setAutodescGenero] = useState(false);

  const [listaPronomes, setListaPronomes] = useState(patientData.pronomes || []);
  const [autodescPronome, setAutodescPronome] = useState(false);
  const [outroPronome, setOutroPronome] = useState("");

  const selectedGenero = patientData.genero || "";
  const showGenderInput = selectedGenero === "Outra identidade";
  const showPronounsInput =
    selectedGenero === "Outra identidade" ||
    selectedGenero === "Prefiro não informar";

  const handleSelectGenero = (opt: string) => {
    updatePatientData({ genero: opt });

    if (opt !== "Outra identidade") setOutroGenero("");

    if (opt === "Mulher") setListaPronomes(["Ela/Dela"]);
    else if (opt === "Homem") setListaPronomes(["Ele/Dele"]);
    else setListaPronomes([]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    // Gênero
    if (!patientData.genero) e.genero = "Por favor, informe sua identidade.";
    if (patientData.genero === "Outra identidade" && !outroGenero.trim())
      e.outroGenero = "Por favor, informe sua identidade.";
    // Pronomes
    if (
      (patientData.genero === "Outra identidade" ||
        patientData.genero === "Prefiro não informar") &&
      listaPronomes.length === 0 &&
      !outroPronome.trim()
    )
      e.pronomes = "Por favor, informe seu(s) pronome(s).";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (outroGenero.trim())
      updatePatientData({ genero: `${outroGenero.trim()}` });

    const listaPronAux = outroPronome.trim()
      ? [...listaPronomes, outroPronome.trim()]
      : listaPronomes;
    updatePatientData({ pronomes: listaPronAux });

    onNext();
  };

  const isActive = (opt: string) => selectedGenero === opt;

  return (
    <>
      <div className="step-header">
        <div className="icon-hero">
          <Heart size={22} className="md:hidden" />
          <Heart size={26} className="hidden md:block" />
        </div>
        <h2>{patientData.primeiroNome}, você se considera...</h2>
        <p>Informações sobre como se referir a você</p>
        {stepNumber && totalSteps && (
          <div className="step-badge">
            Etapa {stepNumber} de {totalSteps}
          </div>
        )}
      </div>

      <div className="step-divider" />

      <div className="space-y-4 md:space-y-5">
        {/* Opções de gênero */}
        <div>
          <div className="flex flex-col gap-2.5 md:gap-3">
            {opcoesGenero.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectGenero(opt)}
                className={`selection-card ${isActive(opt) ? "selection-card-active" : ""}`}
              >
                {isActive(opt) && (
                  <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check size={12} className="text-primary-foreground" />
                  </div>
                )}
                <span className="mr-1.5 text-base md:text-lg"></span> {opt}
              </button>
            ))}
          </div>
          {errors.genero && <p className="error-text mt-3">{errors.genero}</p>}
        </div>

        {/* Outras opções de gênero */}
        {showGenderInput && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="label-cadus">Como você se considera? *</label>
            <div className="flex flex-col gap-2.5 md:gap-3 my-2">
              {outrasOpcoesGenero.map((opt, i) => (
                <label className="label-cadus flex items-center gap-3 mx-4">
                  <input
                    key={i}
                    type="radio"
                    name="outroGeneroBtn"
                    onChange={() => {
                      if (opt === "Prefiro me autodescrever") {
                        setAutodescGenero(true);
                        setOutroGenero("");
                      } else {
                        setAutodescGenero(false);
                        setOutroGenero(opt);
                      }
                    }}
                    className="w-5 h-5 rounded-md border-2 border-border accent-primary"
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {autodescGenero && (
                <input
                  className="input-cadus"
                  value={outroGenero}
                  onChange={(e) => setOutroGenero(e.target.value)}
                  placeholder="Digite aqui..."
                />
              )}
            </div>
            {errors.outroGenero && (
              <p className="error-text">{errors.outroGenero}</p>
            )}
          </div>
        )}

        {/* Opções de pronomes */}
        {showPronounsInput && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="label-cadus">
              Qual/Quais pronome(s) você prefere? *
            </label>
            <div className="flex flex-col gap-2.5 md:gap-3 my-2">
              {opcoesPronome.map((opt, i) => (
                <label className="label-cadus flex items-center gap-3 mx-4">
                  <input
                    key={i}
                    type="checkbox"
                    checked={
                      i === opcoesPronome.length - 1
                        ? autodescPronome
                        : listaPronomes.includes(opt)
                    }
                    onChange={() => {
                      if (i === opcoesPronome.length - 1) {
                        setAutodescPronome(!autodescPronome)
                      } else {
                        if (!listaPronomes.includes(opt))
                          setListaPronomes([...listaPronomes, opt]);
                        else
                          setListaPronomes(
                            listaPronomes.filter(
                              (filterOpt) => filterOpt !== opt,
                            ),
                          );
                      }
                    }}
                    className="w-5 h-5 rounded-md border-2 border-border accent-primary"
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {autodescPronome && (
                <input
                  className="input-cadus"
                  value={outroPronome}
                  onChange={(e) => setOutroPronome(e.target.value)}
                  placeholder="Digite aqui..."
                />
              )}
            </div>
            {errors.pronomes && <p className="error-text">{errors.pronomes}</p>}
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

export default StepPatientGender;
