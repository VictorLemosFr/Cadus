# ADR-0001 - Adoção de Moderação Humana e Delegação da Triagem no Microserviço de Cadastro

- **Status:** Revisão
- **Data:** 10-04-2026
- **Decisores:** Time de Arquitetura
---

## Contexto e Situação Problema: 
Os stakeholders precisam de um sistema para direcionar pacientes encaminhados para as clínicas da UFPE. Inicialmente, cogitou-se criar um microserviço de Inteligência Artificial e computação visual para processar queixas e ler fichas. No entanto, o uso de IA adicionava grande complexidade à arquitetura distribuída e levantou preocupações sobre a segurança e precisão dos encaminhamentos de saúde. É necessário definir a fronteira de responsabilidade do sistema de cadastro em relação à triagem.

## Opções consideradas
Desenvolver um microserviço dedicado de IA para processamento de linguagem natural (NLP) e visão computacional, integrado via mensageria ao serviço principal.
Desenvolver um microserviço de Autocadastro padronizado, sem IA, onde o direcionamento muda de um processo automatizado para uma mudança de estado no sistema acionada manualmente (moderação humana) por supervisores.

## Resultados da Decisão:
Foi decidido adotar o microserviço de Autocadastro dependente de moderação humana, descartando o serviço de IA (decisão firmada entre 13/04 e 20/04). Justificativa: A validação humana é muito mais segura para o ambiente clínico. Do ponto de vista arquitetural, descartar o microserviço de IA reduz drasticamente a complexidade de infraestrutura, os pontos de falha na rede e os custos de processamento. O microserviço de Autocadastro focará apenas na coleta e disponibilidade dos dados para as interfaces dos supervisores.

## Consequências:
**Good**: Redução da complexidade da malha de serviços (service mesh); maior confiabilidade e segurança médica nas decisões de triagem; escopo do microserviço de pacientes fica mais coeso e simples.

**Bad**: Menor escalabilidade do processo de triagem; dependência de rotas de API adicionais para que as interfaces de supervisão consultem e atualizem o status dos encaminhamentos manualmente.