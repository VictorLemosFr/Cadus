# Cadus — Documentação do Projeto

Plataforma de **autocadastro e triagem de pacientes** para uma clínica-escola de Fonoaudiologia da UFPE. O sistema é um **monorepo de microsserviços** em TypeScript, executado sobre o runtime **Bun**, orquestrado via **Docker Compose** e servido atrás de um **reverse proxy nginx** sob o path `/fonoaudiologia/`.

## 📌 Índice

- [✨ Features & Capacidades](#-features--capacidades)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🏗️ Estrutura do Monorepo](#️-estrutura-do-monorepo)
- [🧭 Serviços & Portas](#-serviços--portas)
- [🎯 Princípios de Arquitetura](#-princípios-de-arquitetura)
- [⚙️ Pré-requisitos & Instalação](#️-pré-requisitos--instalação)
- [🔐 Variáveis de Ambiente](#-variáveis-de-ambiente)
- [🚀 Executando o Projeto](#-executando-o-projeto)
- [🗄️ Banco de Dados & Migrations](#️-banco-de-dados--migrations)
- [🧪 Suíte de Testes](#-suíte-de-testes)
- [➕ Criando um Novo Serviço](#-criando-um-novo-serviço)
- [🧰 Ferramentas de Apoio](#-ferramentas-de-apoio)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## ✨ Features & Capacidades

O Cadus é uma plataforma distribuída projetada para isolamento de contextos e separação clara de responsabilidades.

- 🧾 **Autocadastro de pacientes:** fluxo guiado de cadastro (`register`) com validação de CPF, CEP, e-mail e telefone.
- 🔐 **Autenticação JWT:** login por CPF + senha, sessões e bloqueio por tentativas (`auth`), com hashes de senha via bcrypt.
- 🗂️ **Histórico clínico:** serviço dedicado (`historico`) para o acompanhamento de pacientes.
- 🛡️ **Clean Architecture:** camada de domínio agnóstica a frameworks, com regra de dependência apontando sempre para dentro.
- 🔄 **Monorepo com Bun Workspaces:** dependências e configs (TypeScript, ESLint, Prettier) gerenciadas de forma centralizada.
- 🌐 **Reverse proxy nginx:** um único ponto de entrada (porta 80) roteando frontend e APIs sob `/fonoaudiologia/`.
- 🐳 **Ambiente containerizado:** todo o stack sobe com um único `docker compose up`.

## Vídeo de Demonstração:
https://youtu.be/bbaOgqIOLTs

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Papel no Ecossistema |
| ------ | ---------- | -------------------- |
| Runtime & Package Manager | **Bun 1.x** | Motor de execução, gerenciador de workspaces e watcher de dev. |
| Backend Framework | **Express 5** | Roteamento e interface HTTP nos microsserviços. |
| Frontend | **React 18 + Vite + TypeScript** | SPA de alta performance com HMR, servida sob o base path `/fonoaudiologia/`. |
| Banco de Dados | **PostgreSQL (Neon, serverless)** | Persistência por serviço, isolada. |
| ORM / Data Access | **Prisma 7** (`@prisma/adapter-neon` / `adapter-pg`) | Modelagem, migrations e acesso ao banco. |
| Autenticação | **JWT** (`jsonwebtoken`) + **bcrypt** | Tokens de sessão e hash de senhas. |
| Validação | **Zod** | Validação de schemas de entrada. |
| Testes Unitários | **Vitest** | Validação de Use Cases, Entities e adapters. |
| Testes E2E | **Playwright** | Jornadas de usuário no frontend. |
| Qualidade de Código | **ESLint + Prettier** | Padronização estática e formatação. |
| Orquestração & Infra | **Docker Compose + nginx** | Containerização e reverse proxy. |

## 🏗️ Estrutura do Monorepo

```plaintext
cadus/
├── apps/
│   ├── frontend/           # SPA React + Vite + TypeScript (base path /fonoaudiologia/)
│   ├── register/           # Microsserviço de cadastro/identidade de pacientes (porta 3000)
│   ├── auth/               # Microsserviço de autenticação JWT e sessões (porta 3001)
│   ├── historico/          # Microsserviço de histórico do paciente (porta 3002)
│   └── docs/               # Documentação de arquitetura
├── nginx/
│   ├── default.conf        # Regras de proxy (frontend + /api/<serviço>/)
│   └── Dockerfile
├── docker-compose.yml      # Orquestração de todos os serviços
├── package.json            # Workspaces, scripts maestros e dependências globais
├── tsconfig.json           # Configuração TypeScript base (referencia cada app)
└── vitest.config.ts        # Configuração raiz do Vitest
```

## 🧭 Serviços & Portas

O nginx (porta **80**) é o único ponto de entrada. Ele encaminha o frontend e faz `proxy_pass` das APIs, removendo o prefixo do path:

| Serviço | Porta interna | Rota pública (via nginx) | Responsabilidade |
| ------- | ------------- | ------------------------ | ---------------- |
| `frontend` | 8080 | `/fonoaudiologia/` | Interface SPA |
| `register` | 3000 | `/fonoaudiologia/api/register/` | Cadastro e identidade de pacientes |
| `auth` | 3001 | `/fonoaudiologia/api/auth/` | Login, JWT e sessões |
| `historico` | 3002 | `/fonoaudiologia/api/historico/` | Histórico clínico |

> O `auth` consome o `register` internamente (`REGISTER_SERVICE_URL`) para buscar o usuário por CPF no login. Nenhum serviço acessa o banco de outro — a comunicação é sempre via HTTP.

## 🎯 Princípios de Arquitetura

Cada microsserviço segue as regras abaixo para garantir manutenibilidade e isolamento.

**1. Macro-Arquitetura (Microsserviços)**
- **Responsabilidade Única:** cada serviço resolve um único domínio de negócio.
- **Isolamento de Dados:** cada serviço é dono exclusivo da sua persistência. Acesso direto ao banco alheio é proibido; a comunicação acontece via API HTTP.

**2. Micro-Arquitetura (Clean Architecture)**

O núcleo de negócio (Domínio) dita as regras; os detalhes técnicos (Express, Prisma, Neon) adaptam-se a ele. A organização interna varia em maturidade entre os serviços — `register` e `historico` adotam o layout completo, `auth` uma variação mais enxuta:

```plaintext
src/
├── index.ts               # Entry point — apenas inicializa o servidor
├── presentation/          # Controllers e adapters HTTP (register, historico)
│   └── controllers/
├── application/           # Use cases, ports (interfaces) e DTOs
│   └── usecases/
├── domain/                # Entities e value objects (regras de negócio puras)
│   └── entities/
├── infra/                 # Implementações: repositórios Prisma, adapters de DB, providers
│   ├── adapters/          # ex.: db.ts (cliente Prisma + Neon)
│   └── database/          # schema.prisma, migrations, repositórios
├── main/                  # Composição: server, rotas e factories (injeção de dependência)
└── shared/                # Either, erros e utilitários compartilhados
```

> No `auth`, a camada HTTP fica em `app/`, os use cases em `usecases/` e as entities em `entities/` — mesma filosofia, nomenclatura mais simples.

**3. Regra de Dependência (DIP)**

As dependências fluem de fora para dentro. O Domínio nunca conhece o Express nem o Prisma.

```plaintext
presentation (Express) ──> application (use cases) ──> domain (entities / ports) <── infra (Prisma / Neon)
```

## ⚙️ Pré-requisitos & Instalação

### Pré-requisitos

- **Bun 1.x** — runtime e gerenciador de pacotes (dispensa Node.js).
- **Docker** + **Docker Compose** — para subir o stack completo.
- Uma instância **PostgreSQL** por serviço de dados (recomendado: [Neon](https://neon.tech)).

```bash
# Instalação do Bun
curl -fsSL https://bun.sh/install | bash
bun --version

# Docker — verifique se está instalado
docker --version
```

### Instalação do Monorepo

```bash
git clone https://github.com/seu-org/cadus.git
cd cadus

# Instala todas as dependências dos workspaces de uma vez
bun install
```

## 🔐 Variáveis de Ambiente

Cada serviço tem um `.env.example`. Copie-o para `.env` no diretório do serviço e preencha. Ao rodar via Docker Compose, as variáveis abaixo são lidas de um `.env` na **raiz** do projeto.

**Raiz (consumido pelo `docker-compose.yml`):**

| Variável | Descrição |
|----------|-----------|
| `NEON_DATABASE_URL_REGISTER` | Connection string do banco do `register` |
| `DATABASE_URL_AUTH` | Connection string do banco do `auth` |
| `NEON_DATABASE_URL_HISTORICO` | Connection string do banco do `historico` |
| `JWT_SECRET` | Segredo para assinatura dos tokens JWT |

**Por serviço (`.env` local, para rodar fora do Docker):**

| Serviço | Variáveis |
|---------|-----------|
| `register` | `NEON_DATABASE_URL`, `PORT=3000`, `CORS_ORIGIN`, `NODE_ENV` |
| `auth` | `DATABASE_URL`, `JWT_SECRET`, `REGISTER_SERVICE_URL`, `PORT=3001`, `CORS_ORIGIN`, `NODE_ENV` |
| `historico` | `NEON_DATABASE_URL_DEV`, `PORT=3002`, `CORS_ORIGIN`, `NODE_ENV` |
| `frontend` | `VITE_AUTH_URL`, `VITE_REGISTER_URL`, `VITE_HISTORICO_URL` *(opcionais — o fallback são os paths relativos do nginx)* |

> Se `NEON_DATABASE_URL` não estiver definido, o `register` cai num repositório **in-memory** (volátil) — útil para testes rápidos, mas os dados se perdem a cada restart do container.

## 🚀 Executando o Projeto

### Via Docker Compose (recomendado)

Sobe frontend, os três microsserviços e o nginx de uma vez:

```bash
docker compose up

# Em background
docker compose up -d

# Derrubar
docker compose down
```

Acesse a aplicação em **http://localhost/fonoaudiologia/**.

### Localmente com Bun (sem Docker)

```bash
# Um serviço específico
bun --filter @cadus/frontend dev
bun --filter @cadus/register dev
bun --filter @cadus/auth dev
bun --filter @cadus/historico dev

# Todos em paralelo
bun dev:all
```

### Build de produção do frontend

```bash
bun --filter @cadus/frontend build
bun --filter @cadus/frontend preview
```

## 🗄️ Banco de Dados & Migrations

Cada serviço de dados tem seu próprio `schema.prisma` em `src/infra/database/prisma/` e migrations versionadas.

```bash
# Gerar o Prisma Client (roda automaticamente no boot dos containers)
bunx prisma generate

# Aplicar as migrations no banco
bunx prisma migrate deploy

# Via Docker, no container do serviço:
docker compose exec register sh -c "cd /app/apps/register && bunx prisma migrate deploy"
```

> O Prisma é configurado via `prisma.config.ts` de cada serviço, que aponta o `schema` e a `datasource` para a variável de ambiente correspondente.

## 🧪 Suíte de Testes

| Tipo | Escopo | Localização | Ferramenta |
| ---- | ------ | ----------- | ---------- |
| Unitário / Integração | Use Cases, Entities e adapters | `apps/<app>/src/**/*.test.ts(x)` | Vitest |
| End-to-End | Jornadas do usuário no frontend | `apps/frontend/**` | Playwright |

```bash
# Suíte unitária do monorepo
bun test

# Watch mode
bun test --watch

# Cobertura
bun test --coverage

# Apenas um serviço
bun --filter @cadus/auth test
```

## ➕ Criando um Novo Serviço

Siga este passo a passo para expandir o ecossistema mantendo a Clean Architecture.

**1. Estrutura de pastas**

```bash
mkdir -p apps/meu-servico/src/{presentation/controllers,application/usecases,domain/entities,infra/{adapters,database},main,shared}
cd apps/meu-servico
```

**2. `package.json` do serviço** (`apps/meu-servico/package.json`)

```json
{
  "name": "@cadus/meu-servico",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "test": "bunx vitest"
  },
  "devDependencies": {
    "@types/bun": "^1.3.14",
    "@types/express": "^4.17.0",
    "prisma": "^7.8.0",
    "typescript": "^6.0.3",
    "vitest": "^3.2.4"
  },
  "dependencies": {
    "express": "^5.2.1",
    "zod": "^4.4.3"
  }
}
```

**3. Servidor base** (`src/index.ts`)

```typescript
import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3003;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "meu-servico" });
});

app.listen(PORT, () => {
  console.log(`[meu-servico] rodando na porta ${PORT}`);
});
```

**4. Registrar no `tsconfig.json` raiz**

```json
{
  "references": [
    { "path": "apps/frontend" },
    { "path": "apps/register" },
    { "path": "apps/auth" },
    { "path": "apps/historico" },
    { "path": "apps/meu-servico" }
  ]
}
```

**5. Adicionar o serviço ao `docker-compose.yml`** (seguindo o padrão dos demais: `image: oven/bun:1.3`, `command` com `bun install` + `prisma generate` + `dev`, e a rota correspondente no `nginx/default.conf`).

Por fim, rode `bun install` na raiz para sincronizar os workspaces.

## 🧰 Ferramentas de Apoio

- **Diagramas & Modelagem:** Mermaid para diagramas de sequência no Markdown e draw.io para plantas arquiteturais.
- **Modelagem de Dados:** DrawSQL para as entidades do sistema.
- **Design & UI:** Figma para design system e prototipação.
- **Governança & Agilidade:** Jira / GitHub Projects para Sprints e mapeamento de débitos técnicos.

## 🤝 Contribuição

1. Faça o fork do repositório.
2. Crie sua branch de feature: `git checkout -b feature/MinhaFeature`.
3. Valide o alinhamento antes do commit: `bun test` e `bun lint`.
4. Abra o Pull Request para a branch `main`.

## 📄 Licença

Este projeto está sob a licença **Apache 2.0**. Veja o arquivo `LICENSE` para mais detalhes.

---

Powered by **Cadus** | Desenvolvido com foco em Engenharia de Software de Impacto
