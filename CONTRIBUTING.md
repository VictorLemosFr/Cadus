# Contribuiting to Cadus

 Agradecemos o esforço de todos os colaboradores para manter a qualidade, a padronização e a segurança do código de **Cadus**! Este é uma ferramenta de cadastro para as clínicas escola da Universidade federal de Pernambuco (UFPE).

## Pré-requisitos

- Node.js (v18+)
- Bun

## Como Rodar os Serviços Localmente

1. **Clone o repositório**:
   ```
   git clone https://github.com/Cinovar/Cadus.git
   cd Cadus
   ```

2. **Acesse o serviço**:
    ``
    cd apps/service
    ``

3. **Instale as dependências**:
   ```
   bun install
   ```

4. **Configure o ambiente do serviço**:
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`
   - Preencha as variáveis necessárias:
     - `DATABASE_NEON_URL`: URL do seu projeto NEON
     - `DATABASE_NEON_POOLER`: Pooler do seu projeto NEON
     - `DATABASE_NEON_ANON_KEY`: Chave anônima do NEON

5. **Execute o projeto**:
   ```
   bun run dev
   ```

6. **Ou faça o build para produção**:
   ```
   bun run build
   ```

O frontend da aplicação estará disponível em `http://localhost:5173`

## Como Abrir um Pull Request (PR)

1. **Fork o repositório**: Clique em "Fork" no GitHub para criar uma cópia em sua conta.

2. **Clone seu fork**:
   ```
   git clone https://github.com/Cinovar/Cadus.git
   cd Cadus
   ```

3. **Crie uma branch para sua feature/bugfix**:
   ```
   git checkout -b minha-feature
   ```

4. **Faça suas alterações**:
   - Teste localmente com `bun run dev`.
   - Siga o estilo de código do projeto.

5. **Commite suas mudanças**:
   ```
   git add .
   git commit -m "Descrição clara da mudança"
   ```

6. **Push para sua branch**:
   ```
   git push origin minha-feature
   ```

7. **Abra um Pull Request**:
   - Vá para seu fork no GitHub e clique em "Compare & pull request".
   - Descreva suas mudanças e escolha o branch principal do repositório original.

Antes de enviar, certifique-se de que o código funciona corretamente e segue os padrões do projeto.

## Equipe de Colaboradores

<table> 
    <tr>
        <td align="center">
          <a href="https://github.com/Clarinhaaa">
            <img src="https://avatars.githubusercontent.com/u/100969119?v=4" width="100px;" alt="Ana Clara Calvacante"/><br>
            <sub><b>Ana Clara Calvacante</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/ama9-cin-ufpe">
            <img src="https://avatars.githubusercontent.com/u/249635822?v=4" width="100px;" alt="Alex Mayrinck"/><br>
            <sub><b>Alex Mayrinck</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/bernardobelfort">
            <img src="https://avatars.githubusercontent.com/u/153245112?v=4" width="100px;" alt="Bernardo Belfort Leao"/><br>
            <sub><b>Bernardo Belfort Leao</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/edisiouchoacn-spec">
            <img src="https://avatars.githubusercontent.com/u/235191061?v=4" width="100px;" alt="Edísio Uchoa Cavalcanti Neto"/><br>
            <sub><b>Edísio Uchoa Cavalcanti Neto</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/FranciscoFaustino17">
            <img src="https://avatars.githubusercontent.com/u/209528271?v=4" width="100px;" alt="Francisco Faustino de Souza Neto"/><br>
            <sub><b>Francisco Faustino de Souza Neto</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/GabrielCassio">
            <img src="https://avatars.githubusercontent.com/u/91679814?v=4" width="100px;" alt="Gabriel Cássio Gomes Cileiro"/><br>
            <sub><b>Gabriel Cássio Gomes Cileiro</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/orgs/Cinovar/people/rafaelsamico">
            <img src="https://avatars.githubusercontent.com/u/207333347?v=4" width="100px;" alt="Rafael Samico"/><br>
            <sub><b>Rafael Samico</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/VictorLemosFr">
            <img src="https://avatars.githubusercontent.com/u/107511134?v=4" width="100px;" alt="Victor Lemos de Freitas"/><br>
            <sub><b>Victor Lemos de Freitas</b></sub>
          </a>
        </td>
      </tr>
</table>
