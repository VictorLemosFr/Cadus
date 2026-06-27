# ADR-0005 — Adoção do Neon como Banco de Dados do Microsserviço de Identidade

- **Status:** Aceito
- **Data:** 2026-05-31
- **Decisores:** Time de Arquitetura

---

## Contexto e Situação Problema

O microsserviço de identidade gerencia usuários, credenciais, sessões e perfis em um ambiente multi-tenant, onde cada clínica tem isolamento de dados. A escolha do banco de dados precisa atender a requisitos críticos desse serviço:

- **Compatibilidade total com PostgreSQL** — o Prisma ORM (ADR-0001) e as migrations existentes assumem Postgres como dialeto; qualquer banco que exija adaptações de query ou schema seria um risco direto
- **Isolamento de dados por tenant** — o modelo multi-tenant exige segurança e separação garantida entre clínicas
- **Ambientes de desenvolvimento e staging isolados** — o time precisa testar migrations e mudanças de schema sem risco de afetar produção
- **Baixo overhead operacional** — a equipe não possui time dedicado de DBA; o banco deve ser gerenciado com mínima configuração de infraestrutura

---

## Opções Consideradas

- **Neon** — Postgres serverless com arquitetura que separa compute de storage; compatibilidade 100% com o ecossistema PostgreSQL; branching por Copy-on-Write nativo; escalonamento para zero quando ocioso; certificações SOC 2 Type 2, HIPAA e ISO 27001
- **Supabase** — Postgres gerenciado com camada de BaaS (auth, storage, realtime) embutida; amplamente adotado, mas a camada extra de abstrações gera acoplamento desnecessário para um serviço que já gerencia sua própria autenticação; possui SOC 2 Type 2 e HIPAA
- **AWS RDS (PostgreSQL)** — Postgres gerenciado tradicional; alta maturidade, HIPAA Eligible Service e SLA robusto, mas sem branching nativo e maior overhead de configuração de rede e acesso

---

## Resultado da Decisão

Adotar o **Neon** como banco de dados do microsserviço de identidade.

A decisão é ancorada na compatibilidade total com PostgreSQL: o Neon é 100% compatível com o ecossistema Postgres — qualquer ferramenta, extensão ou driver que funciona com Postgres funciona com Neon sem adaptação. Isso garante que o Prisma, as migrations e as queries existentes continuem funcionando sem alteração.

Além da compatibilidade, dois benefícios reforçam a escolha: o **branching por Copy-on-Write** permite criar ambientes de staging e desenvolvimento isolados com o estado real do banco de produção em segundos — útil para testar migrations do Prisma antes de aplicá-las em produção —, e o modelo **serverless com escalonamento para zero** reduz overhead em ambientes não-produtivos que ficam inativos na maior parte do tempo.

### Sobre o driver de conexão

O Neon oferece dois modos de conexão:

- **Conexão direta (TCP)** — recomendada para o microsserviço de identidade em produção, onde o processo é de longa duração e o Prisma gerencia o pool de conexões internamente
- **Driver serverless (`@neondatabase/serverless`)** — compatível com `node-postgres` e indicado para funções de curta duração (lambdas, edge functions); pode ser adotado pontualmente se o serviço evoluir para esse modelo

### Sobre conformidade com dados de saúde

O sistema opera com dados de pacientes do SUS, classificados como **dados sensíveis** pela LGPD (Lei 13.709/2018). A conformidade exigível no contexto brasileiro é:

- **LGPD** — exige base legal para tratamento de dados sensíveis, consentimento explícito, medidas técnicas de segurança e registro do tratamento junto à ANPD; o Neon está em conformidade
- **HIPAA** — padrão americano de segurança para dados de saúde (PHI); não é exigência legal no Brasil, mas serve como referência de maturidade; o Neon possui certificação HIPAA desde março de 2025, exigindo assinatura de BAA para ativação

---

## Consequências

**Good**:
- Compatibilidade total com Postgres garante zero necessidade de adaptação no Prisma, migrations e queries existentes
- Branching por Copy-on-Write permite testar migrations em staging com estado real do banco antes de aplicar em produção
- Sem overhead de gerenciamento de instâncias ou snapshots manuais
- Pool de conexões integrado relevante para o modelo multi-tenant
- Certificações SOC 2 Type 2, HIPAA e ISO 27001 atendem os requisitos de conformidade do sistema
- Point-in-time recovery disponível sem configuração adicional

**Bad**:
- Cold start ao reativar compute após ociosidade — mitigado desabilitando scale-to-zero em produção
- Storage separado do compute via rede: queries analíticas pesadas (relatórios de auditoria) podem ter latência superior à de um Postgres co-localizado
- Mecanismo de branching e API de gerenciamento são específicos do Neon — a camada de dados em si (Postgres) é portável, mas workflows de CI/CD que usam branches precisariam ser reescritos em caso de migração
- Ativação do HIPAA exige assinatura de BAA com o fornecedor — etapa burocrática que deve ser concluída antes de armazenar dados reais de pacientes em produção