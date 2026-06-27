import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, Heart, FileText, Sparkles, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLoginForm } from '@/hooks/useLoginForm';
import { formatCPF } from '@/lib/masks';
import { useRegistrationStore } from '@/store/registrationStore';

const Login = () => {
  const { cpf, setCpf, password, setPassword, errors, handleSubmit, isLoading } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const resetRegistration = useRegistrationStore((state) => state.reset);

  const handleCriarConta = () => {
    resetRegistration();      // zera isRegistered/patientData de um cadastro anterior
    navigate('/cadastro');
};

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Seus dados protegidos',
      description: 'Criptografia de ponta a ponta para todas as suas informações de saúde.',
    },
    {
      icon: Heart,
      title: 'Acompanhamento contínuo',
      description: 'Histórico completo de consultas, exames e tratamentos em um só lugar.',
    },
    {
      icon: FileText,
      title: 'Acesso rápido',
      description: 'Cartão SUS digital, receitas e documentos sempre à mão.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center px-16 xl:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent to-primary/10" />

        <svg className="absolute -top-20 -left-20 w-80 h-80 opacity-20" viewBox="0 0 200 200">
          <path fill="hsl(var(--primary))" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.2,-1.1C86.3,14.1,80,28.2,71.4,40.3C62.8,52.4,51.8,62.5,39,69.9C26.2,77.3,11.6,82,-2.4,85.8C-16.4,89.6,-33.8,92.5,-47.2,86.2C-60.6,79.9,-70,64.4,-76.8,48.4C-83.6,32.4,-87.8,16.2,-86.5,0.7C-85.3,-14.7,-78.6,-29.4,-69.8,-42.1C-61,-54.8,-50.1,-65.5,-37.3,-73.5C-24.5,-81.5,-9.8,-86.8,3.1,-91.9C16,-97,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute -bottom-16 -right-16 w-64 h-64 opacity-15" viewBox="0 0 200 200">
          <path fill="hsl(var(--secondary))" d="M39.5,-65.3C52.9,-59.5,67,-52.4,74.8,-41C82.6,-29.6,84.1,-14.8,82.3,-0.9C80.6,13,75.7,26,67.4,36.7C59.1,47.4,47.4,55.8,34.8,62.2C22.2,68.6,8.6,73,-4.2,79.4C-17,85.8,-34,94.2,-46.3,87.3C-58.6,80.4,-66.2,58.2,-72.3,39.1C-78.4,20,-83,-6,-78.4,-28.4C-73.8,-50.8,-59.9,-69.6,-43.5,-74.1C-27.1,-78.6,-8.1,-68.8,3.2,-74.3C14.5,-79.8,26.1,-71.1,39.5,-65.3Z" transform="translate(100 100)" />
        </svg>

        <div className="relative z-10">
          <Link to="/" className="font-display font-800 text-3xl text-primary tracking-tight mb-12 inline-block">
            cadus<span className="text-highlight">.</span>
          </Link>

          <h1 className="font-display font-800 text-4xl xl:text-5xl text-foreground leading-tight mb-4">
            A forma mais segura de{' '}
            <span className="text-primary">cuidar da sua saúde</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-md">
            Gerencie seus dados de saúde, acompanhe consultas e tenha acesso rápido a documentos importantes.
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-foreground text-sm">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-start justify-center pt-6 px-4 pb-8 lg:items-center lg:pt-0 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-5">
            <Link to="/" className="font-display font-800 text-xl text-primary tracking-tight">
              cadus<span className="text-highlight">.</span>
            </Link>
          </div>

          <div className="card-cadus">
            {/* Toggle Entrar / Criar conta */}
            <div className="flex bg-muted rounded-xl p-1 mb-5 md:mb-6">
              <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground transition-all min-h-[40px]">
                Entrar
              </button>
              <button
                onClick={handleCriarConta}
                className="flex-1 py-2 text-sm font-semibold rounded-lg text-muted-foreground hover:text-foreground transition-all min-h-[40px]"
              >
                Criar conta
              </button>
            </div>

            <h2 className="font-display font-800 text-lg md:text-xl text-foreground mb-0.5">Entrar na conta</h2>
            <p className="text-muted-foreground text-sm mb-4 md:mb-6">Bem-vindo de volta! Insira seus dados.</p>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {/* CPF */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">CPF</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    maxLength={14}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-[16px] md:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
                {errors.cpf && <p className="error-text">{errors.cpf}</p>}
              </div>

              {/* Senha */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-input bg-background text-foreground text-[16px] md:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-3"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              {/* Erro geral (CPF não encontrado, senha errada, etc) */}
              {errors.submit && (
                <p className="text-sm text-destructive text-center">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-1"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4 md:my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-xs">ou continue com</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={() =>
                toast({
                  title: 'Em breve!',
                  description: 'Login sem senha será ativado em breve.',
                })
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Entrar sem senha
            </button>

            <p className="text-center text-muted-foreground text-xs mt-4 md:mt-6 leading-relaxed">
              Ao continuar, você concorda com os{' '}
              <span className="text-primary font-medium cursor-pointer hover:underline">Termos de Uso</span> e{' '}
              <span className="text-primary font-medium cursor-pointer hover:underline">Política de Privacidade</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;