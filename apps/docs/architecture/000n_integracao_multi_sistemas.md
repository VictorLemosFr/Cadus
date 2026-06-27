# ADR-0003 - Integração de Domínios entre Equipes via APIs Restritas (Microserviços Independentes)

- **Status:** Revisão
- **Data:** 16-03-2026
- **Decisores:** Time de Arquitetura
---

## Contexto e Situação Problema:
O projeto exige gerenciar o ecossistema das clínicas (pacientes e profissionais de saúde). Nossa equipe deve focar na jornada do paciente, mas foi sugerido integrar nossa solução com a da Equipe 7, responsável pelos profissionais. Para que a integração funcione de forma segura e padronizada (conforme as exigências de 31/03), precisamos definir como esses dois domínios arquiteturais irão coexistir e se comunicar.

## Opções consideradas:
Construir um monólito englobando o cadastro de pacientes e profissionais, absorvendo o trabalho da Equipe 7 na mesma base de código e banco de dados.
Adotar uma arquitetura de microserviços descentralizada, onde nossa equipe constrói e implanta o "Microserviço de Pacientes" e a Equipe 7 implanta o "Microserviço de Profissionais", comunicando-se via API REST/Mensageria com um contrato de dados rigoroso.

## Resultado das Decisões:
Foi decidido adotar microserviços independentes e integrar com a Equipe 7 através de APIs bem definidas. Justificativa: Segregar o sistema em microserviços estabelece "Bounded Contexts" claros. Nossa equipe será dona do banco de dados e das regras de negócio do paciente (autocadastro, segurança, histórico), enquanto a Equipe 7 gerencia os profissionais e a moderação. Isso exige a criação de um padrão de dados interoperável entre as equipes e garante que cada serviço seja escalado e mantido de forma independente.

## Consequências:
**Good**: Desacoplamento técnico e de repositório entre as equipes; cada time pode escolher a stack de front/back que preferir dentro do seu domínio; isolamento de falhas (se o serviço de profissionais cair, o autocadastro do paciente pode continuar funcionando).

**Bad**: Necessidade de gerenciar a comunicação pela rede (latência, tratamento de falhas HTTP/gRPC); dependência de contratos rígidos de API (Swagger/OpenAPI) entre equipes para que os dados fluam corretamente.