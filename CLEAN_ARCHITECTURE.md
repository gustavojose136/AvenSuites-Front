# 🏗️ Arquitetura Limpa - AvenSuites Frontend

## 📐 Estrutura do Projeto

```
src/
├── domain/                    # Camada de Domínio (Entities, Interfaces)
│   ├── entities/              # Entidades do domínio
│   ├── repositories/          # Interfaces dos repositórios
│   └── services/              # Interfaces dos serviços
│
├── application/                # Camada de Aplicação (Use Cases)
│   ├── services/              # Implementação dos serviços
│   ├── dto/                   # Data Transfer Objects
│   └── use-cases/             # Casos de uso específicos
│
├── infrastructure/            # Camada de Infraestrutura
│   ├── api/                   # Clientes da API
│   ├── storage/               # LocalStorage, SessionStorage
│   └── http/                  # Configurações HTTP
│
├── presentation/              # Camada de Apresentação (UI)
│   ├── components/            # Componentes React
│   ├── pages/                 # Páginas da aplicação
│   ├── hooks/                 # Custom Hooks
│   └── contexts/              # Contextos React
│
└── shared/                    # Código Compartilhado
    ├── types/                 # Types TypeScript
    ├── utils/                 # Utilitários
    ├── constants/             # Constantes
    └── validators/            # Validadores
```

## 🎯 Princípios SOLID Aplicados

### S - Single Responsibility Principle
- Cada arquivo tem uma única responsabilidade
- Componentes focados em uma funcionalidade específica
- Serviços com responsabilidade única

### O - Open/Closed Principle
- Interfaces permitem extensão sem modificação
- Componentes fechados para modificação, abertos para extensão

### L - Liskov Substitution Principle
- Implementações intercambiáveis através de interfaces
- Polimorfismo através de abstrações

### I - Interface Segregation Principle
- Interfaces específicas e coesas
- Evita dependências de métodos não utilizados

### D - Dependency Inversion Principle
- Dependências de abstrações, não concretizações
- Inversão de controle via dependency injection

## 🚀 Fluxo de Dados

```
User Action → Presentation → Application → Infrastructure → API
     ↑                                                            ↓
     └───────────────────── Response ────────────────────────────┘
```

## 📦 Módulos

1. **Auth Module** - Autenticação e autorização
2. **Hotels Module** - Gestão de hotéis
3. **Rooms Module** - Gestão de quartos
4. **Bookings Module** - Gestão de reservas
5. **Guests Module** - Gestão de hóspedes
6. **Invoices Module** - Gestão de faturas
7. **Users Module** - Gestão de usuários

## 🔄 Padrões Utilizados

- **Repository Pattern** - Abstração de acesso a dados
- **Service Pattern** - Lógica de negócio encapsulada
- **Factory Pattern** - Criação de objetos complexos
- **Observer Pattern** - Reatividade do React
- **Strategy Pattern** - Algoritmos intercambiáveis

