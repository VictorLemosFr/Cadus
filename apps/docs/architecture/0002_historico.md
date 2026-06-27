# ADR - 0002 Versionamento de Dados e Padrão Append-Only no Banco de Dados do Microserviço de Pacientes

- **Status:** Revisão
- **Data:** 16-03-2026
- **Decisores:** Time de Arquitetura

---

## Contexto e Situação Problema:
Na reunião de 31/03, os stakeholders exigiram que "nenhuma informação deve ser perdida, apenas versionada", para garantir a integridade do histórico clínico e cadastral (ex: evolução, gênero, nome social). Na arquitetura de microserviços, onde nosso time possui controle exclusivo sobre a persistência do "Domínio do Paciente" (Database-per-service), precisamos definir como o banco lidará com as atualizações vindas do front-end sem perder o rastro de auditoria.

## Opções Consideradas:
Implementar o padrão CRUD simples (Update/Delete físico) no microserviço, perdendo o histórico de mudanças.
Usar gatilhos (triggers) no banco de dados relacional para espelhar dados alterados para tabelas de log.
Implementar um padrão Append-only (Event Sourcing simplificado ou Soft-Delete com versionamento no backend), onde o microserviço de pacientes apenas insere novos registros indicando o estado mais atual, sem deletar ou sobrescrever os anteriores.

## Resultado da Decisão:
Foi decidido adotar a arquitetura de persistência Append-only no Microserviço de Pacientes. Justificativa: Em microserviços que lidam com dados sensíveis de saúde, a imutabilidade dos dados garante conformidade com regras de segurança rigorosas (também enfatizadas em 31/03). Quando o paciente atualiza seu cadastro pela API, o serviço insere um novo registro com timestamp no banco de dados isolado da equipe, em vez de alterar a linha existente, preservando a cronologia completa da evolução do paciente.

## Consequências:
**Good**: Auditoria descentralizada e 100% segura no escopo do nosso microserviço; atende à exigência estrita dos stakeholders de preservação total; prepara o serviço para uma possível evolução para arquitetura orientada a eventos (Event Sourcing real).

**Bad**: Aumenta a carga útil (payload) e a lógica de processamento dentro do microserviço na hora de montar o estado "atual" do paciente para enviar via API ao front-end ou ao serviço da Equipe 7; crescimento acelerado do armazenamento no banco de dados isolado.