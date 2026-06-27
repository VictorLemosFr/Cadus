import { Heart, Stethoscope, Check } from 'lucide-react';
import { useRegistrationStore } from '@/store/registrationStore';
import { toast } from '@/hooks/use-toast';

const StepSelectRole = () => {
  const { setRole, setRoleStep } = useRegistrationStore();

  const handleSelect = (selected: 'paciente' | 'profissional') => {
    setRole(selected);
    setRoleStep(false);
  };

  return (
    <>
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-800 text-foreground tracking-tight">
          Como você vai usar o <span className="text-primary">Cadus</span>?
        </h2>
        <p className="text-muted-foreground/70 mt-2 font-body text-[13px] md:text-[15px]">Escolha uma opção para começar.</p>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {/* Paciente */}
        <button
          onClick={() => handleSelect('paciente')}
          className='group relative flex flex-col items-center text-center rounded-2xl border-2 p-5 pb-6 md:p-6 md:pb-7 transition-all duration-300 focus:outline-none cursor-pointer border-primary/15 bg-gradient-to-b from-primary/[0.03] to-transparent hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8 hover:scale-[1.02]'
        >

          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, hsl(184 45% 42%), hsl(184 55% 32%))',
              boxShadow: '0 8px 24px hsla(184, 45%, 35%, 0.3)',
            }}
          >
            <Heart size={24} className="text-white md:hidden" />
            <Heart size={28} className="text-white hidden md:block" />
          </div>

          <h3 className="font-display font-700 text-foreground text-base md:text-lg">
            Sou Paciente
          </h3>
          <p className="text-[14px] md:text-sm text-muted-foreground mt-1 leading-relaxed max-w-[260px]">
            Quero fazer meu cadastro para ser atendido.
          </p>
        </button>

        {/* Profissional */}
        <button
          onClick={() =>
            toast({
              title: "Em breve!",
              description: "Cadastro de profissional em breve."
            })
          }
          className='group relative flex flex-col items-center text-center rounded-2xl border-2 p-5 pb-6 md:p-6 md:pb-7 transition-all duration-300 focus:outline-none cursor-pointer border-secondary/15 bg-gradient-to-b from-secondary/[0.03] to-transparent hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/8 hover:scale-[1.02]'
        >
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, hsl(30 70% 55%), hsl(30 65% 42%))',
              boxShadow: '0 8px 24px hsla(30, 65%, 45%, 0.3)',
            }}
          >
            <Stethoscope size={24} className="text-white md:hidden" />
            <Stethoscope size={28} className="text-white hidden md:block" />
          </div>

          <h3 className="font-display font-700 text-foreground text-base md:text-lg">
            Sou Profissional
          </h3>
          <p className="text-[14px] md:text-sm text-muted-foreground mt-1 leading-relaxed max-w-[260px]">
            Profissional de saúde, docente ou discente.
          </p>
        </button>
      </div>
    </>
  );
};

export default StepSelectRole;
