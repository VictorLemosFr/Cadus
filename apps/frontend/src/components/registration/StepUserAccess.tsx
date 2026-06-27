import { useState } from "react";
import { useRegistrationStore } from "@/store/registrationStore";
import { Lock, ArrowLeft, Check, Eye, EyeOff, Mail } from "lucide-react";
import { validateEmail } from "@/lib/validation";
import RegisterButton from "../RegisterButton";

interface Props {
  onNext: () => void;
  onBack: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const StepUserAccess = ({ onNext, onBack, stepNumber, totalSteps }: Props) => {
  const { userData, updateUserData } =
    useRegistrationStore();
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const senha = userData.senha || "";
  const hasMin8 = senha.length >= 8;
  const hasUpper = /[A-Z]/.test(senha);
  const hasNumber = /\d/.test(senha);
  const passMatch = senha === confirmSenha && senha.length > 0;

  const strength = [hasMin8, hasUpper, hasNumber].filter(Boolean).length;
  const strengthLabel =
    strength === 0 ? ""
      : strength === 1 ? "Fraca"
        : strength === 2 ? "Média"
          : "Forte";
  const strengthColor =
    strength === 1 ? "text-destructive"
      : strength === 2 ? "text-amber-500"
        : strength === 3 ? "text-emerald-600"
          : "";

  const validate = () => {
    const e: Record<string, string> = {};

    if (!userData.email || !validateEmail(userData.email))
      e.email = "Por favor, informe um e-mail válido.";
    if (!hasMin8 || !hasUpper || !hasNumber)
      e.senha = "A senha não atende aos requisitos.";
    if (!passMatch) e.confirm = "As senhas não coincidem.";
    if (!acceptedTerms) e.terms = "Você precisa aceitar os termos.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <>
      <div className="step-header">
        <div className="icon-hero">
          <Lock size={22} className="md:hidden" />
          <Lock size={26} className="hidden md:block" />
        </div>
        <h2>Por fim, as informações da sua conta</h2>
        <p>Para que você consiga acessá-la novamente depois</p>
        {stepNumber && totalSteps && (
          <div className="step-badge">
            Etapa {stepNumber} de {totalSteps}
          </div>
        )}
      </div>

      <div className="step-divider" />

      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="label-cadus">E-mail *</label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              type="text"
              className="input-cadus pl-12"
              value={userData.email || ""}
              onChange={(e) => updateUserData({ email: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="label-cadus">Crie uma senha *</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="input-cadus pr-12"
              value={senha}
              onChange={(e) => updateUserData({ senha: e.target.value })}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {senha.length > 0 && (
            <div className="mt-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5 flex-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-all duration-500"
                      style={{
                        background:
                          strength >= i
                            ? i === 1
                              ? "hsl(0, 72%, 51%)"
                              : i === 2
                                ? "hsl(40, 90%, 50%)"
                                : "hsl(160, 60%, 40%)"
                            : "hsl(220, 13%, 91%)",
                      }}
                    />
                  ))}
                </div>
                {strengthLabel && (
                  <span
                    className={`text-[11px] md:text-xs font-display font-600 ${strengthColor}`}
                  >
                    {strengthLabel}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {[
                  { ok: hasMin8, text: "Pelo menos 8 caracteres" },
                  { ok: hasUpper, text: "Uma letra maiúscula" },
                  { ok: hasNumber, text: "Um número" },
                ].map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-[11px] md:text-xs font-body transition-colors ${req.ok ? "text-primary" : "text-muted-foreground/40"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.ok ? "bg-primary" : "bg-muted"}`}
                    >
                      <Check
                        size={10}
                        className={
                          req.ok
                            ? "text-primary-foreground"
                            : "text-muted-foreground/30"
                        }
                      />
                    </div>
                    {req.text}
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.senha && <p className="error-text">{errors.senha}</p>}
        </div>

        <div>
          <label className="label-cadus">Repita a senha *</label>
          <input
            type={showPass ? "text" : "password"}
            className="input-cadus"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            placeholder="Confirme sua senha"
          />
          {errors.confirm && <p className="error-text">{errors.confirm}</p>}
        </div>

        <button
          type="button"
          onClick={() => setAcceptedTerms(!acceptedTerms)}
          className={`w-full text-left rounded-xl md:rounded-2xl border-2 p-3.5 md:p-4 flex items-start gap-3 transition-all duration-300 ${acceptedTerms ? "border-primary bg-accent" : "border-border/60 bg-card hover:border-primary/30"}`}
        >
          <div
            className={`w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${acceptedTerms ? "bg-primary" : "border-2 border-border"}`}
          >
            {acceptedTerms && (
              <Check size={12} className="text-primary-foreground" />
            )}
          </div>
          <span className="text-[13px] md:text-sm text-muted-foreground leading-relaxed font-body">
            Li e aceito os{" "}
            <a
              href="#"
              className="text-primary underline"
              onClick={(e) => e.stopPropagation()}
            >
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a
              href="#"
              className="text-primary underline"
              onClick={(e) => e.stopPropagation()}
            >
              Política de Privacidade
            </a>
          </span>
        </button>
        {errors.terms && <p className="error-text">{errors.terms}</p>}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3 md:mt-4 text-[11px] md:text-xs text-muted-foreground/50">
        <Lock size={12} />
        <span>
          Seus dados estão protegidos.{" "}
          <a href="#" className="text-primary underline">
            Saiba mais.
          </a>
        </span>
      </div>

      <RegisterButton
      onValidate={validate}
      onNext={onNext}
      emailProp={userData.email}
      senhaProp={userData.senha}
      />

      <button onClick={onBack} className="btn-back">
        <ArrowLeft size={16} /> Voltar
      </button>
    </>
  );
};

export default StepUserAccess;
