# ADR-0001 — Adoção do Prisma ORM no Microsserviço de Identidade

- **Status:** Aceito
- **Data:** 30-05-2026
- **Decisores:** Time de Arquitetura

---

## Contexto e Situação Problema

O microsserviço de identidade gerencia usuários, credenciais, sessões e perfis em um ambiente multi-tenant, onde cada clínica tem isolamento de dados. O serviço é implementado em Node.js com TypeScript e precisa de uma camada de acesso a dados que ofereça:

- Tipagem forte end-to-end, desde o schema até as queries
- Suporte a migrações versionadas e auditáveis
- Modelagem de relacionamentos complexos: Usuário, Clínica, Papel, Permissão, Sessão
- Boa experiência de desenvolvimento (DX) com autocompletar e erros em tempo de compilação

---

## Opções Consideradas

- **Prisma ORM** — schema declarativo, client gerado automaticamente com tipos derivados do schema
- **TypeORM** — amplamente usado no ecossistema NestJS, usa decorators nas entidades
- **Sequelize** — ORM mais maduro do ecossistema Node.js, suporte a TypeScript adicionado posteriormente

---

## Resultado da Decisão

Adotar o **Prisma ORM (v5+)** como camada de acesso a dados do microsserviço de identidade.

O Prisma foi escolhido pela segurança de tipos end-to-end — o client gerado a partir do `schema.prisma` elimina erros de tipo em runtime, crítico para um serviço de autenticação e autorização. O suporte a `$transaction` garante atomicidade nas operações críticas (criação de usuário + vínculo com tenant + papel inicial). As migrations versionadas garantem rastreabilidade das mudanças de schema em produção.

---

## Consequências

**Good**:
- Tipagem automática derivada do schema elimina erros de tipo em runtime
- Migrations declarativas e versionadas facilitam rollback e auditoria de mudanças
- Prisma Studio acelera o debugging dos dados em desenvolvimento
- `$transaction` garante atomicidade nas operações críticas de identidade
- `schema.prisma` serve como documentação viva do modelo de dados

**Bad**:
- `prisma generate` precisa ser executado a cada mudança de schema — etapa adicional no CI/CD
- Queries muito complexas (ex.: relatórios de auditoria) podem exigir `$queryRaw`, perdendo tipagem
- Não suporta herança de tabelas nativamente — a hierarquia Usuário/Profissional exigirá composição explícita
- Curva de aprendizado do modelo de relações (include vs select vs nested writes) para novos membros