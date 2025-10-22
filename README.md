# Sistema de Login e Cadastro - Comercial Ribeiro

Sistema de autenticação completo para a Comercial Ribeiro, empresa de materiais de construção. O projeto inclui páginas de login, cadastro e catálogo de produtos, com integração ao Firebase para persistência de dados.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework de CSS utilitário
- **shadcn/ui** - Biblioteca de componentes
- **Firebase** - Backend as a Service (Firestore Database)

## 📁 Estrutura do Projeto

### Frontend (Interface do Usuário)

```
app/                          # Páginas da aplicação (App Router)
├── page.tsx                  # Página inicial com botões de login/cadastro
├── login/
│   └── page.tsx             # Página de login
├── register/
│   └── page.tsx             # Página de cadastro
├── produto/
│   └── page.tsx             # Catálogo de produtos
├── dashboard/
│   └── page.tsx             # Dashboard pós-login
├── layout.tsx               # Layout raiz da aplicação
└── globals.css              # Estilos globais e configuração Tailwind

component/                    # Componentes reutilizáveis customizados
├── Logo.tsx                 # Componente do logo da empresa
└── RedButton.tsx            # Botão vermelho padrão da aplicação

components/                   # Componentes shadcn/ui (gerados automaticamente)
├── ui/                      # Componentes base da UI
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── toast.tsx
│   └── ...
└── theme-provider.tsx       # Provedor de tema

hooks/                        # Hooks customizados
├── use-mobile.tsx           # Hook para detecção de dispositivos móveis
└── use-toast.ts             # Hook para notificações toast

lib/                         # Utilitários e configurações
├── utils.ts                 # Funções utilitárias (cn, etc.)
└── firebase.ts              # Configuração e inicialização do Firebase

public/                      # Arquivos estáticos
├── favicon.ico              # Ícone da aplicação
└── logo.png                 # Logo da Comercial Ribeiro
```

### Backend (APIs e Lógica de Servidor)

```
app/api/                     # Rotas da API (Server-side)
├── login/
│   └── route.ts            # API de autenticação de usuários
└── register/
    └── route.ts            # API de cadastro de novos usuários
```

### Configurações

```
next.config.mjs              # Configuração do Next.js
package.json                 # Dependências e scripts
tsconfig.json               # Configuração do TypeScript
```

## 🔥 Firebase - Estrutura do Banco de Dados

### Coleção: `users`
```javascript
{
  id: "documento_id_automatico",
  name: "Nome do Usuário",
  email: "usuario@email.com",
  password: "senha_hash",
  createdAt: "timestamp"
}
```

## 🎯 Funcionalidades

### Frontend
- **Página Inicial**: Interface com logo e botões de acesso
- **Sistema de Login**: Formulário de autenticação com validação
- **Sistema de Cadastro**: Registro de novos usuários
- **Catálogo de Produtos**: Lista de materiais de construção
- **Componentes Reutilizáveis**: Logo e botões padronizados
- **Notificações Toast**: Feedback visual para ações do usuário
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela

### Backend
- **API de Login**: Validação de credenciais no Firebase
- **API de Registro**: Criação de novos usuários no Firestore
- **Integração Firebase**: Conexão com banco de dados NoSQL
- **Tratamento de Erros**: Logs detalhados e respostas padronizadas

## 🚦 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar Firebase:**
   - As configurações já estão definidas em `lib/firebase.ts`
   - Certifique-se de que o projeto Firebase está ativo

3. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação:**
   - Abra [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

- **Cores Principais**: Vermelho corporativo (#dc2626) e tons de cinza
- **Tipografia**: Geist Sans (títulos) e Geist Mono (código)
- **Componentes**: Baseados em shadcn/ui com customizações
- **Layout**: Flexbox responsivo com Tailwind CSS

## 📱 Fluxo da Aplicação

1. **Página Inicial** → Escolha entre Login ou Cadastro
2. **Cadastro** → Criação de conta → Redirecionamento para produtos
3. **Login** → Autenticação → Acesso ao catálogo de produtos
4. **Produtos** → Visualização do catálogo da Comercial Ribeiro

## 🔧 Arquitetura

O projeto segue a arquitetura do Next.js 15 com App Router:
- **Frontend**: Componentes React renderizados no cliente
- **Backend**: API Routes executadas no servidor
- **Banco de Dados**: Firebase Firestore (NoSQL)
- **Autenticação**: Sistema customizado com Firebase
- **Estado**: Gerenciamento local com React hooks
