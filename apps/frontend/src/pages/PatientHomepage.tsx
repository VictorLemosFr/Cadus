import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, FileText, CalendarDays, LogOut, MessageSquare, Loader2 } from 'lucide-react';
import { registerApi, historicoApi } from '@/lib/api';
import Footer from '@/components/Footer';

// Shape que o endpoint /pacientes/:cpf/perfil devolve
interface PerfilPaciente {
  nome: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  email: string;
  telefone: string;
  queixa: string | null;
  status: string | null;
}

interface Consulta {
  id: string;
  motivoConsulta: string;
  diagnostico?: string;
  instituicao: string;
  dataConsulta: string;
}

const PatientHomepage = () => {
  const navigate = useNavigate();
  const { cpf, clearSession } = useAuthStore();

  const [perfil, setPerfil] = useState<PerfilPaciente | null>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Sem CPF na sessão = não está logado
    if (!cpf) {
      navigate('/entrar');
      return;
    }

    const carregar = async () => {
      try {
        const dados = await registerApi.get<PerfilPaciente>(`/pacientes/${cpf}/perfil`);
        setPerfil(dados);

        // Histórico é opcional — se falhar, não quebra a página
        try {
          const hist = await historicoApi.get<Consulta[]>(`/consultas/${cpf}`);
          setConsultas(hist);
        } catch {
          setConsultas([]);
        }
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [cpf, navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  // Formata data ISO para DD/MM/YYYY
  const formatarData = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR');
    } catch {
      return iso;
    }
  };

  // Formata CPF mascarado
  const formatarCpf = (c: string) =>
    c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4">
        <p className="text-destructive text-center">{erro}</p>
        <button onClick={handleLogout} className="btn-outline">Voltar ao início</button>
      </div>
    );
  }

  const nome = perfil?.nome || 'Paciente';
  const firstName = nome.split(' ')[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-12 md:h-14">
          <span className="font-display font-800 text-primary text-lg tracking-tight">cadus<span className="text-highlight">.</span></span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-[13px] md:text-sm text-foreground font-body hidden sm:block">{nome}</span>
            <button onClick={handleLogout} className="btn-ghost text-[13px] md:text-sm py-1 px-3 text-muted-foreground min-h-[44px]">
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-4 px-3 md:py-8 md:px-4">
        <div className="container max-w-2xl space-y-4 md:space-y-6">
          {/* Welcome */}
          <div className="hero-gradient rounded-2xl p-5 md:p-6 lg:p-8 relative z-10">
            <h1 className="text-xl md:text-2xl font-display font-800 text-primary-foreground tracking-tight">
              Olá, {firstName}! 👋
            </h1>
            <p className="text-primary-foreground/80 mt-1 font-body text-[13px] md:text-base">
              {perfil?.status === 'AGUARDANDO_MODERACAO' && 'Seu cadastro está em análise.'}
              {perfil?.status === 'ENCAMINHADO' && 'Você foi encaminhado para atendimento.'}
              {perfil?.status === 'EM_ATENDIMENTO' && 'Seu atendimento está em andamento.'}
              {perfil?.status === 'CONCLUIDO' && 'Seu atendimento foi concluído.'}
              {!perfil?.status && 'Seu cadastro está completo.'}
            </p>
          </div>

          {/* My data */}
          <div className="card-cadus">
            <h2 className="font-display font-700 text-foreground text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
              Meus dados
            </h2>
            <div className="space-y-0">
              <DataRow label="Nome" value={perfil?.nome} />
              <DataRow label="CPF" value={perfil?.cpf ? formatarCpf(perfil.cpf) : undefined} />
              <DataRow label="Nascimento" value={perfil?.dataNascimento ? formatarData(perfil.dataNascimento) : undefined} />
              <DataRow label="Gênero" value={perfil?.genero} />
              <DataRow label="Telefone" value={perfil?.telefone} />
              <DataRow label="E-mail" value={perfil?.email || 'Não informado'} />
            </div>
          </div>

          {/* Complaint */}
          <div className="card-cadus">
            <h2 className="font-display font-700 text-foreground text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <FileText size={18} className="text-primary" />
              </div>
              Minha queixa registrada
            </h2>
            <p className="text-foreground text-[13px] md:text-sm bg-muted rounded-xl p-3.5 md:p-4 leading-relaxed">
              {perfil?.queixa || 'Nenhuma queixa registrada.'}
            </p>
          </div>

          {/* Histórico de consultas */}
          <div className="card-cadus">
            <h2 className="font-display font-700 text-foreground text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <CalendarDays size={18} className="text-primary" />
              </div>
              Meu histórico de consultas
            </h2>
            {consultas.length === 0 ? (
              <p className="text-muted-foreground text-[13px] md:text-sm">Nenhuma consulta registrada ainda.</p>
            ) : (
              <div className="space-y-2">
                {consultas.map((c) => (
                  <div key={c.id} className="bg-muted rounded-xl p-3.5 md:p-4">
                    <p className="font-600 text-foreground text-[13px] md:text-sm">{c.motivoConsulta}</p>
                    {c.diagnostico && <p className="text-muted-foreground text-[12px] md:text-sm mt-1">{c.diagnostico}</p>}
                    <p className="text-[11px] md:text-xs text-muted-foreground mt-2">{c.instituicao} — {c.dataConsulta}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="card-cadus border-l-4 border-l-secondary">
            <h2 className="font-display font-700 text-foreground text-base md:text-lg mb-1.5 md:mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CalendarDays size={18} className="text-secondary" />
              </div>
              Agendar consulta
            </h2>
            <p className="text-[13px] md:text-sm text-muted-foreground mb-3 md:mb-4">Para agendar sua consulta, entre em contato com a clínica:</p>
            <a href="https://wa.me/5581999999999" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full min-h-[48px]">
              <MessageSquare size={18} /> Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const DataRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-2.5 md:py-3 border-b border-border last:border-0">
    <span className="font-body font-600 text-muted-foreground text-[13px] md:text-sm min-w-[120px] md:min-w-[140px]">{label}</span>
    <span className="text-foreground text-[13px] md:text-sm">{value || '—'}</span>
  </div>
);

export default PatientHomepage;