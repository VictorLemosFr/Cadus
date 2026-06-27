# ADR-0004 — Adoção do Bun como Runtime e Toolchain Padrão

- **Status:** Aceito
- **Data:** 28-05-2026
- **Decisores:** Time de Arquitetura

---

## Contexto e Situação Problema

A plataforma é composta por múltiplos microsserviços em Node.js/TypeScript. Com o crescimento da malha de serviços, o time passou a sentir gargalos no ciclo de desenvolvimento:

- Instalação de dependências lenta com npm
- Necessidade de múltiplas ferramentas para cobrir transpilação, execução em desenvolvimento e testes (tsc, ts-node, nodemon, jest)
- Latência de cold start relevante em ambientes de CI e containers com escalonamento zero
- Drift de versões entre ferramentas, gerando inconsistências entre ambientes locais e de CI/CD

O time avaliou se o runtime poderia ser substituído por uma solução unificada que endereçasse todos esses pontos sem sacrificar compatibilidade com o ecossistema Node.js existente.

---

## Opções Consideradas

- **Bun** — runtime all-in-one com executor, bundler, gerenciador de pacotes e runner de testes nativos; suporte a TypeScript sem configuração adicional; compatível com a maioria dos pacotes npm
- **Node.js + toolchain atual** — manter o status quo com ts-node, nodemon, jest e npm; maduro e amplamente documentado, mas fragmentado em múltiplas ferramentas
- **Deno 2** — runtime seguro por padrão com TypeScript nativo e boa ergonomia; compatibilidade com pacotes npm ainda exige adaptações pontuais

---

## Resultado da Decisão

Adotar o **Bun** como runtime e toolchain padrão em todos os microsserviços, substituindo Node.js, ts-node e jest.

A decisão é motivada pela convergência de quatro ganhos simultâneos: performance em runtime (~3× mais rápido que Node.js em benchmarks de I/O), instalação de pacotes significativamente mais rápida, suporte nativo a TypeScript sem etapa de transpilação, e unificação da toolchain em um único binário — reduzindo a superfície de configuração de CI/CD e o onboarding de novos membros.

### Sobre o gerenciador de pacotes

O **Bun** é a ferramenta preferencial para instalação de dependências (`bun install`, `bun add`, `bun remove`). No entanto, o uso de **npm** ou **pnpm** permanece permitido nos seguintes cenários:

- Dependências ou scripts que apresentem incompatibilidade com o lockfile do Bun (`bun.lockb`)
- Pipelines legados ou integrações de terceiros que exijam explicitamente npm ou pnpm
- Decisão local de um serviço específico, desde que documentada como exceção no README do repositório

Em qualquer caso, o gerenciador utilizado deve ser consistente dentro de cada repositório — não é permitido misturar lockfiles (`bun.lockb`, `package-lock.json`, `pnpm-lock.yaml`) no mesmo projeto.

---

## Consequências

**Good**:
- Cold start reduzido — impacto direto em lambdas e containers com escalonamento zero
- Instalação de pacotes mais rápida, melhorando a etapa de `bun install` no CI
- TypeScript executado diretamente — elimina ts-node, ts-jest e etapas de build em desenvolvimento
- `bun test` substitui Jest com API compatível, sem necessidade de reescrever suítes existentes
- Toolchain unificada reduz drift de versões e simplifica o `Dockerfile`

**Bad**:
- Paridade com Node.js ainda não é total — módulos nativos em C++ (`.node`) podem exigir fallback ou wrapper
- Imagens Docker oficiais do Bun são menores, mas ainda menos maduras em hardening de segurança
- Curva de aprendizado para o time acostumado com Jest e ts-node, mesmo com API compatível
- Ecossistema de plugins e suporte de IDEs ainda menor que o do Node.js
- A flexibilidade de usar npm/pnpm como exceção exige disciplina para não fragmentar os ambientes ao longo do tempo