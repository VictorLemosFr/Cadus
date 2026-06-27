import { toast } from "@/hooks/use-toast";
import { User, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const CtaButtons = () => {
  return (
    <>
      <Link
        to="/cadastro?role=paciente"
        className="flex items-center justify-center gap-2 px-7 py-4 md:px-9 rounded-full bg-card text-primary font-display font-700 text-[15px] md:text-base transition-all duration-200 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] min-h-[52px]"
      >
        <User size={20} />
        Sou Paciente
      </Link>
      <Link
        to="#"
        onClick={() => {
            toast({
                title: "Em breve!",
                description: "Cadastro de profissional em breve."
            })
        }}
        className="flex items-center justify-center gap-2 px-7 py-4 md:px-9 rounded-full border-2 border-primary-foreground/30 text-primary-foreground font-display font-700 text-[15px] md:text-base transition-all duration-200 hover:bg-primary-foreground/10 min-h-[52px]"
      >
        <Briefcase size={20} />
        Sou Profissional
      </Link>
    </>
  );
};

export default CtaButtons;
