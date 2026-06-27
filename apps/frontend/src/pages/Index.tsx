import { UserCheck, ClipboardList, CheckCircle, Smartphone, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CtaButtons from '@/components/CtaButtons';
import Footer from '@/components/Footer';
import heroIllustration from '@/assets/hero-illustration.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* Hero illustration with organic blob shapes */
const HeroIllustration = () => (
  <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[480px] flex items-center justify-center py-2 md:py-6">
    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[320px] md:w-[480px] h-[260px] sm:h-[320px] md:h-[480px] z-0" viewBox="0 0 500 500" fill="none">
      <path d="M400,280Q370,460,200,400Q30,340,80,200Q130,60,300,80Q470,100,400,280Z" fill="hsl(184, 78%, 22%)" fillOpacity="0.22" />
    </svg>
    <svg className="absolute -right-2 md:-right-8 -bottom-1 md:-bottom-3 w-[180px] sm:w-[240px] md:w-[340px] h-[180px] sm:h-[240px] md:h-[340px] z-0" viewBox="0 0 500 500" fill="none">
      <path d="M420,300Q380,480,200,420Q20,360,60,200Q100,40,280,60Q460,80,420,300Z" fill="hsl(25, 76%, 63%)" fillOpacity="0.25" />
    </svg>
    <svg className="absolute -left-2 md:-left-4 -top-1 w-[120px] sm:w-[170px] md:w-[220px] h-[120px] sm:h-[170px] md:h-[220px] z-0" viewBox="0 0 500 500" fill="none">
      <path d="M380,260Q340,420,200,380Q60,340,100,200Q140,60,300,100Q460,140,380,260Z" fill="hsl(184, 60%, 35%)" fillOpacity="0.18" />
    </svg>
    <img
      src={heroIllustration}
      alt="Pessoas diversas conectadas digitalmente ao sistema Cadus"
      className="relative z-10 w-full max-w-[220px] sm:max-w-[280px] md:max-w-[440px] h-auto drop-shadow-xl"
    />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="hero-gradient py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container relative z-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-10 lg:gap-14">
            <motion.div
              className="flex-1 text-center md:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <h1 className="text-[1.65rem] leading-[1.15] sm:text-3xl md:text-4xl lg:text-[3.5rem] font-display font-800 text-primary-foreground tracking-tight">
                Seus dados prontos
                <br />
                <span className="text-highlight">antes</span> da consulta.
              </h1>
              <p className="text-primary-foreground/80 mt-3 text-[12px] md:text-lg lg:text-xl max-w-[320px] sm:max-w-sm md:max-w-lg mx-auto md:mx-0 font-body leading-relaxed">
                Preencha seu cadastro pelo celular, no seu tempo. Quando chegar na clínica, já sabem quem você é.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 mt-8 md:mt-10 md:flex-row md:gap-4 px-4">
                <CtaButtons />
              </div>

              {/* Seção para acalmar FUDs do usuário (Feat, Uncertainty e Doubt) */}
              <div className="flex items-center justify-center md:justify-start gap-5 mt-6 text-primary-foreground/80 text-[12px] md:text-sm font-body">
                <span className="flex items-center gap-1.5"><Smartphone size={14} /> Pelo celular</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> 5 minutos</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Dados seguros</span>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>


      {/* Como funciona (título) */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-28">
        <div className="container max-w-5xl">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="section-label-pill">Passo a passo</span>
            <h2 className="section-title">Como funciona?</h2>
            <p className="section-subtitle max-w-md mx-auto">Três passos simples. Sem complicação.</p>
          </motion.div>

          <div className="relative">
            {/* Linha conectora horizontal (desktop) */}
            <motion.svg
              className="absolute top-[52px] hidden md:block z-0 h-[4px]"
              style={{ left: 'calc(16.666% - 8px)', right: 'calc(16.666% + 44px)' }}
              viewBox="0 0 800 4"
              fill="none"
              preserveAspectRatio="none"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.line
                x1="0" y1="2" x2="800" y2="2"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeOpacity="0.25"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: { pathLength: 1, transition: { duration: 1.2, delay: 0.3, ease: "easeInOut" } },
                }}
              />
            </motion.svg>

            {/* Linha conectora vertical (mobile) */}
            <div className="absolute left-[28px] top-[60px] bottom-[60px] w-px border-l-2 border-dashed border-primary/20 md:hidden z-0" />

            <div className="grid md:grid-cols-3 gap-5 md:gap-6 relative z-10">
              {[
                {
                  num: '01',
                  icon: <UserCheck size={24} className="text-primary-foreground" />,
                  title: 'Escolha seu perfil',
                  desc: 'Siga seu caminho entre paciente e profissional — docente ou discente.',
                },
                {
                  num: '02',
                  icon: <ClipboardList size={24} className="text-primary-foreground" />,
                  title: 'Preencha seus dados',
                  desc: 'Responda no seu ritmo, seus dados ficam salvos automaticamente.',
                },
                {
                  num: '03',
                  icon: <CheckCircle size={24} className="text-primary-foreground" />,
                  title: 'Tudo pronto',
                  desc: 'Seus dados já estão no sistema. Agora é só aguardar o atendimento.',
                },
              ].map((step, i) => (
                /* Cards */
                <motion.div
                  key={i}
                  className="relative group flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="relative shrink-0 mb-0 md:mb-5">
                    <div className="w-14 h-14 md:w-[104px] md:h-[104px] rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary to-[#14919B] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      <div className="scale-100 md:scale-[1.6]">{step.icon}</div>
                    </div>
                  </div>

                  <div className="relative bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-border/50 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300 flex-1 md:flex-none md:w-full overflow-hidden">
                    <span className="absolute -top-2 -right-1 text-[3.5rem] md:text-[5rem] font-display font-800 text-primary/[0.04] leading-none select-none pointer-events-none">
                      {step.num}
                    </span>

                    <span className="text-[11px] md:text-xs font-display font-700 text-muted-foreground tracking-widest uppercase">
                      Passo {step.num}
                    </span>
                    <h3 className="font-display font-700 text-base md:text-xl text-foreground mt-1 md:mt-1.5">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-[13px] md:text-sm mt-1 md:mt-1.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-gradient py-12 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <svg className="absolute -left-10 md:-left-20 -bottom-10 md:-bottom-20 w-[250px] md:w-[450px] h-[250px] md:h-[450px] z-0" viewBox="0 0 500 500" fill="none">
          <path d="M400,280Q370,460,200,400Q30,340,80,200Q130,60,300,80Q470,100,400,280Z" fill="white" fillOpacity="0.07" />
        </svg>

        <div className="container text-center relative z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="section-label-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.15)' }}>
              Comece agora
            </span>
            <h2 className="text-[1.35rem] leading-tight sm:text-3xl md:text-4xl lg:text-5xl font-display font-800 text-primary-foreground tracking-tight">
              Seus dados prontos antes da consulta<span className="text-highlight">.</span>
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <p className="text-primary-foreground/80 mt-2 md:mt-4 text-[13px] md:text-lg font-body max-w-[280px] sm:max-w-sm md:max-w-2xl mx-auto">
              Cadastre-se agora e chegue na clínica pronto para ser atendido.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-4 mt-8 md:mt-10 md:flex-row justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <CtaButtons />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;