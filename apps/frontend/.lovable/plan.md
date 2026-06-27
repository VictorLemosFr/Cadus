

## Problema

Os botões "Entrar" e "Cadastrar" da navbar apontam ambos para `/cadastro`. Não existe página de login dedicada para quem já tem conta.

## Plano

### 1. Criar página de Login (`src/pages/Login.tsx`)

Página inspirada no layout da Ticko mas com a identidade visual Cadus:

**Layout Desktop**: Duas colunas — esquerda com branding/proposta de valor Cadus, direita com card de login.
**Layout Mobile**: Card de login centralizado com logo Cadus acima.

**Componentes do card de login**:
- Título "Entrar na conta" + subtexto de boas-vindas
- Toggle "Entrar / Criar conta" (dois botões pill lado a lado, o ativo com fundo teal)
- Campo Email com ícone inline (Mail)
- Campo Senha com ícone inline (Lock) + botão toggle visibilidade (Eye/EyeOff)
- Botão "Entrar" com gradiente teal (btn-primary estilo)
- Divisor "ou continue com"
- Botão "Entrar sem senha" (magic link placeholder)
- Texto legal "Ao continuar, você concorda com os Termos de Uso e Política de Privacidade"

**Lado esquerdo (desktop only)**:
- Logo "cadus."
- Título com destaque: "A forma mais segura de **cuidar da sua saúde**"
- Subtexto da proposta de valor
- 3 cards de benefício (ícone + título + descrição) como na Ticko

**Comportamento**:
- Toggle "Criar conta" redireciona para `/cadastro`
- Botão "Entrar" por enquanto mostra toast de "em breve" (sem backend ainda)
- Background com gradiente sutil teal como na registration page

### 2. Atualizar Navbar (`src/components/Navbar.tsx`)

- "Entrar" → link para `/entrar`
- "Cadastrar" → link para `/cadastro` (mantém)

### 3. Adicionar rota (`src/App.tsx`)

- Nova rota `/entrar` → componente `Login`

### Arquivos editados
- `src/pages/Login.tsx` (novo)
- `src/components/Navbar.tsx`
- `src/App.tsx`

