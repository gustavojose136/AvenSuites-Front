# 🏨 AvenSuites - Sistema de Gestão Hoteleira

Sistema completo de gestão hoteleira desenvolvido com Next.js 14, TypeScript e Clean Architecture. Plataforma moderna para gerenciar hotéis, quartos, reservas, hóspedes e faturamento.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Autenticação](#autenticação)
- [Módulos Principais](#módulos-principais)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

O AvenSuites é uma plataforma unificada para gestão hoteleira que permite:

- **Gestão de Hotéis**: Cadastro, edição e visualização de hotéis
- **Gestão de Quartos**: Controle completo de quartos com tipos, status e preços dinâmicos
- **Gestão de Reservas**: Criação, confirmação, check-in/check-out e cancelamento de reservas
- **Gestão de Hóspedes**: Cadastro e gerenciamento de hóspedes
- **Faturamento**: Geração automática de notas fiscais
- **Portal do Hóspede**: Área exclusiva para hóspedes visualizarem e gerenciarem suas reservas
- **Dashboard**: Visão geral com estatísticas, KPIs e ações rápidas

## 🛠️ Tecnologias

### Core
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React 18** - Biblioteca UI
- **Tailwind CSS** - Framework CSS utilitário

### Autenticação e Segurança
- **NextAuth.js** - Autenticação e autorização
- **JWT** - Tokens de autenticação
- **Role-based Access Control** - Controle de acesso baseado em roles

### HTTP e API
- **Axios** - Cliente HTTP
- **SSL/TLS** - Suporte a certificados auto-assinados

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **@hookform/resolvers** - Integração Zod + React Hook Form

### UI/UX
- **Framer Motion** - Animações
- **React Hot Toast** - Notificações
- **Next Themes** - Suporte a tema claro/escuro

### Outras
- **date-fns** - Manipulação de datas
- **Prisma** - ORM (opcional, para uso local)

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **SOLID**, organizado em camadas:

```
src/
├── domain/                    # Camada de Domínio
│   ├── entities/             # Entidades de negócio
│   ├── repositories/         # Interfaces dos repositórios
│   └── services/             # Interfaces dos serviços
│
├── application/              # Camada de Aplicação
│   ├── dto/                  # Data Transfer Objects
│   └── use-cases/            # Casos de uso
│
├── infrastructure/           # Camada de Infraestrutura
│   ├── api/                  # Clientes da API
│   │   └── repositories/     # Implementações dos repositórios
│   ├── http/                 # Configurações HTTP
│   └── storage/              # LocalStorage, SessionStorage
│
├── presentation/             # Camada de Apresentação
│   ├── components/           # Componentes React
│   ├── hooks/                 # Custom Hooks
│   └── contexts/             # Contextos React
│
└── shared/                   # Código Compartilhado
    ├── utils/                # Utilitários
    ├── validators/           # Validadores Zod
    ├── hooks/                # Hooks compartilhados
    ├── constants/           # Constantes
    └── di/                   # Dependency Injection
```

### Princípios SOLID Aplicados

- **Single Responsibility**: Cada classe/componente tem uma única responsabilidade
- **Open/Closed**: Extensível sem modificação através de interfaces
- **Liskov Substitution**: Implementações intercambiáveis
- **Interface Segregation**: Interfaces específicas e focadas
- **Dependency Inversion**: Dependências através de abstrações

## ✨ Funcionalidades

### ✅ Módulo de Autenticação
- Login com NextAuth
- Integração com API .NET backend
- Suporte a SSL auto-assinado
- Gestão de tokens JWT
- Controle de acesso baseado em roles (Admin, Manager, Employee, Guest)
- Portal separado para hóspedes

### ✅ Módulo de Hotéis
- Listagem de hotéis
- Detalhes do hotel
- Criação e edição de hotéis
- Exclusão de hotéis
- Filtros e busca

### ✅ Módulo de Quartos
- Listagem de quartos por hotel
- Visualização de status (Disponível, Ocupado, Limpeza, Manutenção, Inativo)
- Criação e edição de quartos
- Tipos de quarto com capacidades e preços
- Preços dinâmicos baseados em ocupação
- Verificação de disponibilidade

### ✅ Módulo de Reservas
- Listagem de reservas com filtros
- Criação de novas reservas
- Detalhes da reserva
- Confirmação de reservas
- Check-in e Check-out
- Cancelamento de reservas
- Geração de notas fiscais
- Visualização em cards ou tabela
- Paginação responsiva

### ✅ Módulo de Hóspedes
- Listagem de hóspedes
- Cadastro de hóspedes
- Detalhes do hóspede
- Edição de hóspedes
- Filtros e busca

### ✅ Módulo de Faturamento
- Listagem de notas fiscais
- Geração automática de notas fiscais
- Filtros por status
- Estatísticas financeiras

### ✅ Dashboard
- KPIs principais (Receita, Ocupação, Reservas, Hóspedes)
- Reservas da semana com paginação
- Operações do dia (Check-ins, Check-outs, Quartos disponíveis)
- Status dos quartos (gráfico visual)
- Estatísticas financeiras
- Top hotéis
- Ações rápidas

### ✅ Portal do Hóspede
- Login exclusivo para hóspedes
- Visualização de perfil
- Listagem de reservas
- Cancelamento de reservas
- Busca de hotéis
- Criação de reservas

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend AvenSuites rodando (API .NET)

### Passos

1. **Clone o repositório**
```bash
git clone <repository-url>
cd AvenSuites-Front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example.txt .env.local
```

4. **Edite o arquivo `.env.local`** com suas configurações:
```env
NEXT_PUBLIC_API_URL=https://localhost:7000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui
```

5. **Gere uma chave secreta para NextAuth** (opcional)
```bash
openssl rand -base64 32
```

6. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

7. **Acesse a aplicação**
```
http://localhost:3000
```

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | ✅ Sim |
| `NEXTAUTH_URL` | URL da aplicação | ✅ Sim |
| `NEXTAUTH_SECRET` | Chave secreta do NextAuth | ✅ Sim |
| `GITHUB_CLIENT_ID` | Client ID do GitHub OAuth | ❌ Não |
| `GITHUB_CLIENT_SECRET` | Client Secret do GitHub OAuth | ❌ Não |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth | ❌ Não |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google OAuth | ❌ Não |
| `DATABASE_URL` | URL do banco de dados (se usar Prisma) | ❌ Não |

### Configuração da API

O projeto está configurado para trabalhar com uma API .NET backend. Certifique-se de que:

1. A API está rodando e acessível
2. A URL da API está correta no `.env.local`
3. O certificado SSL está configurado (se usar HTTPS)
4. O CORS está configurado no backend para permitir requisições do frontend

## 📁 Estrutura do Projeto

```
AvenSuites-Front/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (site)/               # Rotas do site
│   │   │   ├── dashboard/        # Dashboard
│   │   │   ├── hotels/           # Módulo de hotéis
│   │   │   ├── rooms/            # Módulo de quartos
│   │   │   ├── bookings/        # Módulo de reservas
│   │   │   ├── guests/           # Módulo de hóspedes
│   │   │   ├── invoices/         # Módulo de faturamento
│   │   │   └── guest/            # Portal do hóspede
│   │   ├── api/                  # API Routes
│   │   └── layout.tsx            # Layout principal
│   │
│   ├── domain/                   # Camada de Domínio
│   │   ├── entities/             # Entidades
│   │   ├── repositories/         # Interfaces de repositórios
│   │   └── services/             # Interfaces de serviços
│   │
│   ├── application/              # Camada de Aplicação
│   │   └── dto/                  # DTOs
│   │
│   ├── infrastructure/           # Camada de Infraestrutura
│   │   ├── api/                  # Implementações de API
│   │   └── http/                 # Cliente HTTP
│   │
│   ├── presentation/            # Camada de Apresentação
│   │   ├── components/          # Componentes React
│   │   ├── hooks/                # Custom Hooks
│   │   └── contexts/             # Contextos
│   │
│   └── shared/                  # Código Compartilhado
│       ├── utils/               # Utilitários
│       ├── validators/          # Validadores
│       ├── hooks/                # Hooks compartilhados
│       └── di/                  # Dependency Injection
│
├── public/                       # Arquivos estáticos
├── middleware.ts                 # Middleware Next.js
├── next.config.js               # Configuração Next.js
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
└── package.json                 # Dependências
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint

# Configuração
npm run setup        # Executa script de setup
```

## 🔐 Autenticação

### Roles Disponíveis

- **Admin**: Acesso total ao sistema
- **Manager**: Pode gerenciar hotéis, quartos, reservas e hóspedes
- **Employee**: Acesso limitado (visualização)
- **Guest**: Acesso apenas ao portal do hóspede

### Fluxo de Autenticação

1. Usuário faz login através do NextAuth
2. Token JWT é armazenado na sessão
3. Token é enviado automaticamente nas requisições HTTP
4. Middleware valida permissões baseado em roles
5. Componentes usam `RoleGuard` para controle de acesso

### Portal do Hóspede

O portal do hóspede usa autenticação separada:
- Token armazenado em `localStorage` (não usa NextAuth)
- Rotas `/guest/*` não passam pelo middleware NextAuth
- Token JWT é enviado diretamente nas requisições

## 📦 Módulos Principais

### Dashboard (`/dashboard`)
- Visão geral do sistema
- KPIs e estatísticas
- Reservas da semana
- Operações do dia
- Ações rápidas

### Hotéis (`/hotels`)
- Listagem de hotéis
- Criação e edição
- Detalhes do hotel

### Quartos (`/rooms`)
- Listagem por hotel
- Criação e edição
- Status visual
- Tipos de quarto

### Reservas (`/bookings`)
- Listagem com filtros
- Criação de reservas
- Check-in/Check-out
- Geração de notas fiscais

### Hóspedes (`/guests`)
- Listagem de hóspedes
- Cadastro e edição
- Detalhes do hóspede

### Faturamento (`/invoices`)
- Listagem de notas fiscais
- Geração automática
- Filtros e estatísticas

### Portal do Hóspede (`/guest`)
- Login de hóspede
- Busca de hotéis
- Criação de reservas
- Visualização de reservas
- Cancelamento de reservas

## 🎨 Design System

O projeto utiliza:
- **Tailwind CSS** para estilização
- **Design responsivo** (mobile-first)
- **Tema claro/escuro** (Next Themes)
- **Componentes reutilizáveis** seguindo SOLID
- **Animações** com Framer Motion
- **Notificações** com React Hot Toast

## 🔧 Desenvolvimento

### Adicionando um Novo Módulo

1. **Criar DTO** em `src/application/dto/`
2. **Criar Interface de Repositório** em `src/domain/repositories/`
3. **Criar Interface de Serviço** em `src/domain/services/`
4. **Implementar Repositório** em `src/infrastructure/api/repositories/`
5. **Implementar Serviço** em `src/application/services/`
6. **Criar Hook** em `src/presentation/hooks/`
7. **Criar Componentes** em `src/presentation/components/`
8. **Criar Páginas** em `src/app/(site)/`

### Padrões de Código

- Use TypeScript para tipagem
- Siga os princípios SOLID
- Mantenha a separação de camadas
- Use Dependency Injection
- Valide dados com Zod
- Trate erros adequadamente

## 🐛 Troubleshooting

### Erro de SSL
Se encontrar erros de certificado SSL:
- O `HttpClient` está configurado para aceitar certificados auto-assinados
- Em produção, use certificados válidos

### Erro de CORS
Certifique-se de que o backend permite requisições do frontend:
- Configure CORS no backend
- Verifique a URL da API no `.env.local`

### Token inválido
- Verifique se o `NEXTAUTH_SECRET` está configurado
- Limpe o cache do navegador
- Verifique se o token não expirou

## 📝 Licença

Este projeto está sob a licença especificada no arquivo `LICENSE`.

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com ❤️ para gestão hoteleira moderna
