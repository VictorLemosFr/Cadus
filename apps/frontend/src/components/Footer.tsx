import { Plus, Shield, Lock, FileCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Footer = () => (
  <footer className="bg-card mt-auto">
    {/* Conteúdo principal */}
    <div className="border-t border-border pt-5 pb-4 md:pt-14 md:pb-10">
      <div className="container">
        <div className="flex flex-col gap-5 md:grid md:grid-cols-4 md:gap-8">
          {/* Marca */}
          <div className="flex flex-col items-start md:items-start gap-1.5">
            <span className="font-display font-800 text-primary text-lg md:text-xl tracking-tight">
              cadus<span className="text-secondary">.</span>
            </span>
            <span className="text-[12px] md:text-sm text-muted-foreground leading-relaxed">
              Seu cadastro. Sua saúde.
              <br />
              Simples assim.
            </span>
            <span className="text-[12px] md:text-xs text-muted-foreground/80 mt-0.5">
              Desenvolvido pelo CIn — UFPE
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-display font-700 text-[12px] md:text-xs text-foreground tracking-[0.15em] uppercase">
              Informações
            </span>
            <a
              href="#"
              className="text-[12px] md:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 min-h-[40px] md:min-h-0 flex items-center"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-[12px] md:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 min-h-[40px] md:min-h-0 flex items-center"
            >
              Termos de Uso
            </a>
          </div>

          {/* Clínicas */}
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-display font-700 text-[10px] md:text-xs text-foreground tracking-[0.15em] uppercase">
              Sobre Clínicas
            </span>
            <a
              href="#"
              className="text-[12px] md:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 min-h-[40px] md:min-h-0 flex items-center"
            >
              Clínicas Parceiras
            </a>
            <a
              href="#"
              className="text-[12px] md:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 min-h-[40px] md:min-h-0 flex items-center"
            >
              Fale com as Clínicas
            </a>
          </div>

          {/* Para Clínicas */}
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-display font-700 text-[10px] md:text-xs text-foreground tracking-[0.15em] uppercase">
              Para Clínicas
            </span>
            <a
              href="#"
              onClick={() =>
                toast({
                  title: "Em breve!",
                  description: "Personalização das clínicas em breve.",
                })
              }
              className="inline-flex items-center gap-2 text-[12px] md:text-sm text-primary font-semibold hover:text-primary/80 transition-colors py-0.5 min-h-[40px] md:min-h-0"
            >
              <Plus size={14} className="shrink-0" />
              Adicionar nova Clínica
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Barra inferior */}
    <div className="border-t border-border py-3 md:py-5">
      <div className="container flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            <Shield size={12} className="text-primary" />
            Seguro
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            <Lock size={12} className="text-primary" />
            Protegido
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            <FileCheck size={12} className="text-primary" />
            LGPD
          </span>
        </div>
        <span className="text-[10px] md:text-xs text-muted-foreground/60">
          © 2026 cadus. Todos os direitos reservados.
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
