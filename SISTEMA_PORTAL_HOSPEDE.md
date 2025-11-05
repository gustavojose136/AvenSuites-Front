# 🏨 Sistema Portal do Hóspede - Documentação Completa

## 📋 Visão Geral

Implementação completa do sistema de reservas para hóspedes, permitindo que eles:
- ✅ Busquem hotéis disponíveis
- ✅ Selecionem datas de check-in e check-out
- ✅ Se cadastrem no sistema
- ✅ Façam login
- ✅ Visualizem suas reservas
- ✅ Cancelem reservas

---

## 🎯 Fluxo Completo do Usuário

```
1. Página Inicial (/)
   ↓
2. Seleção de Tipo (/user-type)
   ↓ [Clica em "Sou Hóspede"]
   ↓
3. Busca de Hotéis (/guest/search)
   ↓ [Seleciona hotel e datas]
   ↓
4. Registro (/guest/register) ou Login (/guest/login)
   ↓ [Cadastra/Loga]
   ↓
5. Finalizar Reserva (/guest/booking) ✨ NOVO
   ↓ [Escolhe quarto e confirma]
   ↓
6. Portal do Hóspede (/guest/portal)
   ↓
7. Ver/Cancelar Reservas
```

### 1️⃣ Página Inicial → Seleção de Tipo de Usuário

**Rota:** `/user-type`

**Funcionalidade:**
- O usuário escolhe entre **"Sou Hóspede"** ou **"Sou Dono de Hotel"**
- Se escolher **"Sou Hóspede"**, é redirecionado para `/guest/search`
- Se escolher **"Sou Dono de Hotel"**, é redirecionado para `/signin`

**Arquivos:**
- `src/app/(site)/user-type/page.tsx`

---

### 2️⃣ Busca de Hotéis

**Rota:** `/guest/search`

**Funcionalidade:**
- Exibe um formulário de busca com:
  - 📅 Data de check-in
  - 📅 Data de check-out
  - 👥 Número de hóspedes
- Lista todos os hotéis ativos cadastrados
- Calcula automaticamente o número de noites
- Valida as datas (não permite datas passadas, check-out após check-in)
- Ao selecionar um hotel, redireciona para `/guest/register` com os parâmetros da busca

**Validações:**
- Check-in não pode ser no passado
- Check-out deve ser após o check-in
- Datas são obrigatórias para selecionar hotel

**Arquivos:**
- `src/app/(site)/guest/search/page.tsx`

**Integração com API:**
```typescript
GET /Hotel - Lista todos os hotéis
```

---

### 3️⃣ Registro de Novo Hóspede

**Rota:** `/guest/register?hotelId={id}&checkIn={date}&checkOut={date}&guests={num}`

**Funcionalidade:**
- Exibe um resumo da reserva (hotel, datas, número de hóspedes, noites)
- Formulário completo de cadastro dividido em seções:
  - 👤 **Dados Pessoais**: Nome, Data de Nascimento, Tipo de Documento, Número do Documento
  - 📧 **Contato**: E-mail, Telefone
  - 📍 **Endereço**: Logradouro, Complemento, Bairro, Cidade, Estado, CEP
  - 🔒 **Segurança**: Senha e Confirmação de Senha
  - ✅ **Consentimento**: Aceite para receber comunicações de marketing
- Após cadastro bem-sucedido:
  - Salva o token JWT no `localStorage`
  - Redireciona para `/guest/portal` ou para criar a reserva

**Validações:**
- Senha mínima de 6 caracteres
- Senha e confirmação de senha devem ser iguais
- Todos os campos obrigatórios devem ser preenchidos
- E-mail deve ser válido
- Estado com 2 caracteres (UF)

**Arquivos:**
- `src/app/(site)/guest/register/page.tsx`

**Integração com API:**
```typescript
POST /Auth/register-guest
Body: {
  name: string,
  email: string,
  password: string,
  phone: string,
  documentType: string,
  document: string,
  birthDate: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  neighborhood?: string,
  state: string,
  postalCode: string,
  countryCode: string,
  marketingConsent: boolean,
  hotelId: string
}

Response: {
  token: string,
  expiresAt: string,
  user: {
    id: string,
    name: string,
    email: string,
    roles: ["Guest"]
  }
}
```

---

### 4️⃣ Login de Hóspede

**Rota:** `/guest/login?hotelId={id}&checkIn={date}&checkOut={date}&guests={num}`

**Funcionalidade:**
- Formulário de login simples com e-mail e senha
- Após login bem-sucedido:
  - Salva o token JWT no `localStorage`
  - Redireciona para `/guest/portal` ou para criar a reserva (se houver parâmetros)
- Link para cadastro de novo hóspede

**Validações:**
- E-mail e senha são obrigatórios

**Arquivos:**
- `src/app/(site)/guest/login/page.tsx`

**Integração com API:**
```typescript
POST /Auth/login
Body: {
  email: string,
  password: string
}

Response: {
  token: string,
  expiresAt: string,
  user: {
    id: string,
    name: string,
    email: string,
    roles: ["Guest"]
  }
}
```

---

### 5️⃣ Finalizar Reserva

**Rota:** `/guest/booking?hotelId={id}&checkIn={date}&checkOut={date}&guests={num}`

**Funcionalidade:**
- **Proteção de Rota**: Verifica se o usuário está autenticado (token no localStorage)
- **Resumo da Reserva**: Exibe hotel, datas, número de hóspedes e noites
- **Seleção de Quarto**: 
  - Lista quartos disponíveis do hotel
  - Filtra por capacidade (hóspedes)
  - Mostra preço por noite
  - Exibe comodidades
  - Permite seleção via radio button
- **Cálculo Automático**: Calcula o valor total baseado no preço do quarto × número de noites
- **Campo de Observações**: Permite adicionar solicitações especiais
- **Confirmação**: Cria a reserva na API

**Validações:**
- Verifica autenticação
- Valida parâmetros obrigatórios
- Verifica se há quartos disponíveis
- Exige seleção de quarto antes de confirmar

**Arquivos:**
- `src/app/(site)/guest/booking/page.tsx`

**Integração com API:**
```typescript
// Hotel
GET /Hotel/{id}

// Quartos
GET /Rooms?hotelId={id}

// Tipos de Quarto
GET /RoomType

// Criar Reserva
POST /Bookings
Headers: { Authorization: "Bearer {token}" }
Body: {
  hotelId: string,
  mainGuestId: string,
  checkInDate: string,
  checkOutDate: string,
  adults: number,
  children: number,
  status: "CONFIRMED",
  totalAmount: number,
  currency: "BRL",
  source: "DIRECT",
  notes?: string,
  roomIds: [string]
}
```

---

### 6️⃣ Portal do Hóspede

**Rota:** `/guest/portal`

**Funcionalidade:**
- **Proteção de Rota**: Verifica se o usuário está autenticado (token no localStorage)
- **Perfil do Hóspede**: Exibe informações do perfil (nome, e-mail, telefone, hotel)
- **Lista de Reservas**: 
  - Exibe todas as reservas do hóspede
  - Mostra status da reserva (Confirmada, Cancelada, Pendente, etc.)
  - Calcula número de noites
  - Exibe valor total
  - Permite cancelar reservas confirmadas
- **Ações**:
  - Botão "Nova Reserva" → redireciona para `/guest/search`
  - Botão "Sair" → faz logout e limpa localStorage
  - Botão "Cancelar" (em cada reserva confirmada) → abre modal de cancelamento

**Modal de Cancelamento:**
- Confirmação da ação
- Campo opcional para motivo do cancelamento
- Botões "Não, manter" e "Sim, cancelar"

**Arquivos:**
- `src/app/(site)/guest/portal/page.tsx`

**Integração com API:**
```typescript
// Perfil
GET /GuestPortal/profile
Headers: { Authorization: "Bearer {token}" }
Response: {
  id: string,
  name: string,
  email: string,
  phone: string,
  hotelName: string,
  city?: string,
  state?: string
}

// Lista de Reservas
GET /GuestPortal/bookings
Headers: { Authorization: "Bearer {token}" }
Response: [
  {
    id: string,
    code: string,
    checkInDate: string,
    checkOutDate: string,
    adults: number,
    children: number,
    status: string,
    totalAmount: number,
    currency: string,
    notes?: string
  }
]

// Cancelar Reserva
POST /GuestPortal/bookings/{id}/cancel
Headers: { Authorization: "Bearer {token}", Content-Type: "application/json" }
Body: "Motivo do cancelamento (string)"
Response: { message: "Reserva cancelada com sucesso" }
```

---

## 🎨 Design e UX

### Paleta de Cores
- **Primário**: Gradiente de `primary` para `blue-600`
- **Fundo**: Gradiente de `slate-50` → `blue-50` → `indigo-50`
- **Cards**: Brancos com sombras `shadow-xl`
- **Status**:
  - ✅ Confirmada: Verde
  - ❌ Cancelada: Vermelho
  - ⏳ Pendente: Amarelo
  - 🔵 Check-in Feito: Azul
  - ⚪ Check-out Feito: Cinza

### Componentes Modernos
- **Cards com gradientes** animados no hover
- **Transições suaves** em todos os elementos interativos
- **Ícones SVG** para melhor visualização
- **Loading states** com spinners animados
- **Modals** com backdrop escuro
- **Responsividade** completa (mobile, tablet, desktop)

### Animações
- Hover effects com `hover:scale-105`
- Transições de `duration-300`
- Cards elevam ao passar o mouse (`hover:-translate-y-2`)
- Spinners com `animate-spin`

---

## 🔒 Segurança e Autenticação

### Token JWT
- Armazenado no `localStorage` como `guestToken`
- Informações do usuário armazenadas como `guestUser`
- Token enviado em todas as requisições protegidas via header `Authorization: Bearer {token}`

### Proteção de Rotas
- `/guest/portal` verifica se o token existe
- Se não existir, redireciona para `/guest/login`
- Se o token expirar (401), limpa o localStorage e redireciona para login

### Validações
- **Frontend**: Validações básicas antes de enviar para API
- **Backend**: Validações completas conforme documentação da API

---

## 📱 Responsividade

Todas as páginas são totalmente responsivas:

### Mobile (< 768px)
- Cards em coluna única
- Formulários adaptados
- Botões full-width
- Header com menu hamburguer (se aplicável)

### Tablet (768px - 1024px)
- Grid de 2 colunas para hotéis
- Formulários com 2 colunas
- Layout otimizado

### Desktop (> 1024px)
- Grid de 3 colunas para hotéis
- Formulários com múltiplas colunas
- Aproveitamento total da largura

---

## 🧪 Como Testar

### 1. Fluxo de Registro Completo

1. Acesse: `http://localhost:3000/user-type`
2. Clique em **"Sou Hóspede"** → **"Buscar Hotéis"**
3. Selecione as datas (check-in e check-out) e número de hóspedes
4. Clique em **"Selecionar Hotel"** em um dos hotéis disponíveis
5. Preencha o formulário de cadastro completo
6. Clique em **"Criar Conta e Continuar"**
7. Você será redirecionado para o portal do hóspede

### 2. Fluxo de Login

1. Se já tem conta, na tela de registro clique em **"Fazer Login"**
2. Digite e-mail e senha
3. Clique em **"Entrar"**
4. Você será redirecionado para o portal

### 3. Visualizar Reservas

1. No portal, visualize suas reservas na seção **"Minhas Reservas"**
2. Cada reserva mostra:
   - Código da reserva
   - Status
   - Datas de check-in/check-out
   - Número de hóspedes
   - Número de noites
   - Valor total

### 4. Cancelar Reserva

1. Clique em **"Cancelar"** em uma reserva confirmada
2. Confirme o cancelamento no modal
3. Opcionalmente, digite um motivo
4. Clique em **"Sim, cancelar"**
5. A reserva será cancelada e a lista atualizada

### 5. Fazer Logout

1. No portal, clique em **"Sair"**
2. Você será redirecionado para a página de login
3. O token será removido do localStorage

---

## 🔧 Configuração

### Variável de Ambiente

Certifique-se de que a variável de ambiente `NEXT_PUBLIC_API_URL` está configurada no arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://localhost:7000
```

### HttpClient

O `httpClient` já está configurado para:
- Usar `NEXT_PUBLIC_API_URL` como base URL
- Ignorar certificados SSL em desenvolvimento
- Enviar tokens JWT automaticamente em requisições autenticadas

---

## 📊 Status dos Endpoints

| Endpoint | Status | Descrição |
|----------|--------|-----------|
| `POST /Auth/register-guest` | ✅ Implementado | Registro de novo hóspede |
| `POST /Auth/login` | ✅ Implementado | Login de hóspede |
| `GET /GuestPortal/profile` | ✅ Implementado | Perfil do hóspede |
| `GET /GuestPortal/bookings` | ✅ Implementado | Lista de reservas |
| `POST /GuestPortal/bookings/{id}/cancel` | ✅ Implementado | Cancelar reserva |
| `GET /Hotel` | ✅ Implementado | Lista de hotéis |
| `GET /Hotel/{id}` | ✅ Implementado | Detalhes do hotel |
| `GET /Rooms` | ✅ Implementado | Lista de quartos |
| `GET /RoomType` | ✅ Implementado | Tipos de quarto |
| `POST /Bookings` | ✅ Implementado | Criar reserva |

---

## 🚀 Próximos Passos (Opcional)

- [x] Página para **criar reserva** após login/registro (`/guest/booking`) ✅ IMPLEMENTADO
- [ ] Página de **detalhes da reserva** (`/guest/bookings/{id}`)
- [ ] Página de **editar perfil** (`/guest/profile/edit`)
- [ ] Sistema de **notificações** (e-mail, SMS)
- [ ] Sistema de **avaliações** de hotéis
- [ ] **Recuperação de senha**
- [ ] **Integração com pagamento online**

---

## 🎉 Conclusão

O sistema está **100% funcional** e pronto para uso! Os hóspedes podem:
- ✅ Buscar hotéis
- ✅ Se cadastrar
- ✅ Fazer login
- ✅ **Criar reservas** ✨ NOVO
- ✅ Ver suas reservas
- ✅ Cancelar reservas

Tudo com um design **moderno, atraente e responsivo**!

---

**Versão:** 1.0  
**Data:** 31/10/2025  
**Desenvolvido para:** AvenSuites Frontend

