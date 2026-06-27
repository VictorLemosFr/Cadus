# ADR-0006 — Adoção de Clean Architecture como Estrutura Interna dos Microsserviços

- **Status:** Aceito
- **Data:** 29-05-2026
- **Decisores:** Time de Arquitetura

---

## Contexto e Situação Problema

Com a plataforma organizada em microsserviços independentes (ADR-0001), cada serviço precisa de uma estrutura interna consistente. Uma abordagem inicial baseada em MCSV (Model, Controller, Service, Validator) foi considerada, mas identificou-se um problema estrutural central: o Service acessa o banco de dados (Prisma) diretamente, acoplando regras de negócio à infraestrutura.

As consequências práticas desse acoplamento são:

- Regras de negócio só testáveis com banco real ou mock de ORM — não em isolamento puro
- Impossibilidade de trocar a camada de persistência sem modificar a lógica de domínio
- Services monolíticos com múltiplas responsabilidades que crescem sem fronteira clara
- Ausência de uma convenção para casos de uso que envolvem múltiplas entidades

---

## Definição das Camadas

O padrão adotado organiza cada microsserviço em quatro camadas com dependências unidirecionais:

```
src/
├── domain/          # Entidades, Value Objects, Domain Events, interfaces de repositório
├── application/     # Use Cases, Commands, Queries, interfaces de porta (Port)
├── infrastructure/  # Implementações concretas: Prisma, HTTP clients, brokers, cache
└── interface/       # Controllers, Routers, DTOs, Middlewares, Validators (Zod)
```

### Domain
Camada mais interna. Contém as entidades do negócio, Value Objects, Domain Events e as **interfaces** dos repositórios. Não conhece Prisma, HTTP, Node.js ou qualquer detalhe externo. É testável com objetos em memória, sem nenhuma dependência de infraestrutura.

### Application
Orquestra os casos de uso. Cada operação é um Use Case isolado (ex: `CreatePatientUseCase`, `ApproveReferralUseCase`). Depende das interfaces do Domain, nunca das implementações concretas. Não conhece o framework HTTP nem o banco de dados.

### Infrastructure
Implementa as interfaces definidas no Domain. O `PrismaPatientRepository` implementa `IPatientRepository`. HTTP clients, brokers e cache vivem aqui. É a única camada que conhece o Prisma, bibliotecas externas e protocolos de rede.

### Interface
Ponto de entrada das requisições. Controllers recebem input, acionam validação (Zod), chamam o Use Case e formatam a resposta. Não contém lógica de negócio.

---

## Regra de Dependência

```
Interface → Application → Domain ← Infrastructure
```

Todas as dependências apontam para dentro. O Domain não conhece nada externo. A Infrastructure implementa o que o Domain define — nunca o contrário.

---

## Fluxo de uma Requisição

```
Request → Router → Middleware → Controller → Use Case → Domain → Repository (interface)
                                                              ↑
                                               PrismaRepository (Infrastructure)
```

---

## Opções Consideradas

- **Clean Architecture** — separação estrita entre domínio, aplicação e infraestrutura via inversão de dependência; casos de uso explícitos; testabilidade sem infraestrutura; padrão amplamente adotado no mercado para microsserviços em TypeScript
- **MCSV (Model, Controller, Service, Validator)** — estrutura mais simples, mas acopla regras de negócio ao ORM; Services crescem sem fronteira clara; testabilidade depende de mocks de infraestrutura
- **MVC clássico** — adequado para aplicações com renderização server-side; a camada View não faz sentido em APIs REST; não prescreve separação entre domínio e infraestrutura
- **Arquitetura Hexagonal pura** — conceitualmente equivalente; a terminologia de Ports & Adapters pode ser adotada como vocabulário complementar, especialmente para os pontos de integração com serviços externos

---

## Resultado da Decisão

Adotar **Clean Architecture** como estrutura interna padrão para todos os microsserviços da plataforma, com Use Cases explícitos e Repository Pattern para inversão da dependência de persistência.

A decisão resolve diretamente o problema de acoplamento identificado no MCSV: ao introduzir a interface `IRepository` no domínio e a implementação concreta na Infrastructure, a lógica de negócio deixa de conhecer o Prisma. Use Cases substituem o Service monolítico — cada operação é uma unidade testável isolada, sem depender de framework ou banco.

A estrutura é compatível com o Prisma ORM (apps/identity/docs/ADR-0001): o Prisma vive exclusivamente na camada Infrastructure, implementando as interfaces definidas no Domain.

### Sobre a granularidade dos Use Cases

Cada Use Case representa uma única operação de negócio. Para operações que envolvem múltiplas entidades (ex: criação de usuário + vínculo com tenant + papel inicial), o Use Case orquestra a sequência via `$transaction` do Prisma, chamado pelo Repository — nunca diretamente pelo Use Case.

### Sobre injeção de dependência

Os Use Cases recebem seus repositórios via construtor (Dependency Injection manual ou via container). Em serviços simples, DI manual é suficiente. Para serviços maiores, um container leve como `tsyringe` ou `awilix` pode ser introduzido sem alterar a estrutura de camadas.

---

## Consequências

**Good**:
- Regras de negócio testáveis em isolamento total — sem banco, sem HTTP, sem mocks de ORM
- Troca de ORM ou banco não toca o domínio nem os Use Cases
- Use Cases explícitos tornam o código autodocumentado — a lista de arquivos em `application/` é a lista de operações do serviço
- Compatível com evolução futura para Event Sourcing (ADR-0002) e CQRS sem mudança estrutural
- Consistência entre serviços facilita onboarding e revisão de código entre times

**Bad**:
- Mais arquivos e abstrações do que o MCSV — para CRUDs simples, pode parecer desproporcional
- A disciplina de não vazar Prisma para fora da Infrastructure exige revisão ativa em PRs
- Curva de aprendizado inicial para times acostumados com Service direto no banco
- Sem scaffold automatizado, criar as camadas manualmente para cada nova entidade é repetitivo