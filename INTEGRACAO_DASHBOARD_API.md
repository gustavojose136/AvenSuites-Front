# 🔌 Integração do Dashboard com API Externa

## ✅ O que foi implementado

### 📁 Arquivos Criados:

1. **`src/services/dashboard.service.ts`** - Serviço que busca dados da API
2. **`src/hooks/useDashboard.ts`** - Hooks React para gerenciar estado
3. **Dashboard e Invoices atualizados** - Usando dados reais da API

---

## 🎯 Endpoints da API Utilizados

O serviço faz requisições para os seguintes endpoints da sua API:

```
GET /Hotel         - Busca todos os hotéis
GET /Room          - Busca todos os quartos  
GET /Guest         - Busca todos os hóspedes
GET /Booking       - Busca todas as reservas
GET /Invoice       - Busca todas as notas fiscais
```

---

## 🗺️ Mapeamento de Dados

### O serviço mapeia automaticamente:

**Campos em Português ↔ Inglês:**
```javascript
// Aceita tanto em português quanto inglês
valor || amount           → amount
numero || number          → number
hospedeId || guestId      → guestId
nomeHospede || guestName  → guestName
dataEmissao || issueDate  → issueDate
dataPagamento || paymentDate → paymentDate
```

**Status (Português → Frontend):**
```javascript
'Paga'/'Pago'/'Paid'           → 'paid'
'Pendente'/'Pending'           → 'pending'
'Vencida'/'Vencido'/'Overdue'  → 'overdue'
'Cancelada'/'Cancelled'        → 'cancelled'

'Disponivel'/'Available'       → Available
'Ocupado'/'Occupied'           → Occupied
'Manutencao'/'Maintenance'     → Maintenance
'Limpeza'/'Cleaning'           → Cleaning
```

---

## 📊 Estatísticas Calculadas

O serviço calcula automaticamente:

### 1. **Hotéis**
- Total de hotéis
- Top 3 hotéis por número de reservas
- Taxa de ocupação por hotel

### 2. **Quartos**
- Total de quartos
- Quartos disponíveis
- Taxa de ocupação geral
- Status: Disponível, Ocupado, Manutenção, Limpeza

### 3. **Hóspedes**
- Total de hóspedes cadastrados

### 4. **Reservas**
- Total de reservas
- Reservas ativas (Confirmed + CheckedIn)
- Check-ins hoje
- Check-outs hoje
- Check-outs concluídos

### 5. **Notas Fiscais**
- Total de NFs
- NFs pagas (com receita total)
- NFs pendentes
- NFs vencidas
- Receita total
- Receita mensal (últimos 30 dias)

---

## 🔄 Como Funciona

### 1. **Usuário acessa `/dashboard`**
```
1. Middleware verifica autenticação
2. Hook useDashboard() é executado
3. Serviço faz 5 requisições em paralelo:
   - GET /Hotel
   - GET /Room
   - GET /Guest
   - GET /Booking
   - GET /Invoice
4. Dados são mapeados e calculados
5. Dashboard renderiza com dados reais
```

### 2. **Loading States**
- ⏳ "Verificando autenticação..." - NextAuth validando
- ⏳ "Carregando dados da API..." - Buscando dados
- ✅ Dashboard renderizado com dados
- ❌ Tela de erro com botão "Tentar Novamente"

### 3. **Tratamento de Erros**
```javascript
try {
  const data = await dashboardService.getDashboardStats();
  // Sucesso
} catch (error) {
  // Mostra erro amigável
  // Botão para refetch
}
```

---

## 🎨 Features Implementadas

### Dashboard (`/dashboard`)
- ✅ 4 KPIs principais com dados reais
- ✅ Taxa de ocupação com gráfico circular
- ✅ Receita mensal e total
- ✅ Status de notas fiscais
- ✅ Ações rápidas
- ✅ Status dos quartos com barras
- ✅ Check-ins/Check-outs hoje
- ✅ Top 3 hotéis
- ✅ Loading e error states
- ✅ Botão refetch em caso de erro

### Notas Fiscais (`/invoices`)
- ✅ Lista todas as NFs da API
- ✅ Cards com estatísticas
- ✅ Filtros por status (Todas, Pagas, Pendentes, Vencidas)
- ✅ Busca por número, hóspede ou hotel
- ✅ Tabela responsiva
- ✅ Loading e error states
- ✅ Cores diferenciadas por status

---

## 🔐 Segurança

### Proteção por Token:
```typescript
// middleware.ts
export const config = {
  matcher: [
    '/dashboard/:path*',  // ✅ Protegido
    '/hotels/:path*',
    '/rooms/:path*',
    '/bookings/:path*',
    '/guests/:path*',
  ],
};
```

### Headers Automáticos:
```typescript
// HttpClient adiciona automaticamente
headers: {
  'Authorization': `Bearer ${session.accessToken}`,
  'Content-Type': 'application/json',
}
```

---

## 📝 Exemplo de Resposta da API

### Hotel:
```json
{
  "id": "123",
  "name": "Hotel Paradise",
  "address": "Rua ABC, 123",
  "phone": "(47) 99999-9999"
}
```

### Room:
```json
{
  "id": "456",
  "hotelId": "123",
  "number": "101",
  "type": "Standard",
  "status": "Available",  // ou "Disponivel"
  "pricePerNight": 150.00
}
```

### Invoice:
```json
{
  "id": "789",
  "number": "NF-2024-001",  // ou "numero"
  "guestId": "111",
  "guestName": "João Silva",  // ou "nomeHospede"
  "hotelId": "123",
  "hotelName": "Hotel Paradise",  // ou "nomeHotel"
  "bookingId": "222",
  "amount": 450.00,  // ou "valor"
  "status": "Paid",  // ou "Paga"
  "issueDate": "2024-01-15",  // ou "dataEmissao"
  "dueDate": "2024-01-25",  // ou "dataVencimento"
  "paymentDate": "2024-01-20"  // ou "dataPagamento"
}
```

---

## 🚀 Como Testar

### 1. Verifique se sua API está rodando:
```bash
curl -k https://localhost:7000/api/Hotel \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 2. Faça login no sistema:
```
http://localhost:3000/signin
```

### 3. Acesse o dashboard:
```
http://localhost:3000/dashboard
```

### 4. Veja os logs no console:
```
📊 Buscando estatísticas do dashboard...
✅ Estatísticas carregadas: {...}
```

---

## 🐛 Troubleshooting

### "Erro ao carregar dashboard"
- ✅ Verifique se a API está rodando
- ✅ Confirme que o token é válido
- ✅ Veja os logs do console (F12)
- ✅ Verifique a URL da API em `.env.local`

### "401 Unauthorized"
- ✅ Token expirou - faça login novamente
- ✅ Verifique se o token está sendo enviado
- ✅ Confirme formato do header Authorization

### "404 Not Found"
- ✅ Endpoint não existe na API
- ✅ Verifique a URL base da API
- ✅ Confirme os nomes dos controllers

### Dados não aparecem
- ✅ API retorna array vazio?
- ✅ Campos estão com nomes corretos?
- ✅ Mapeamento está funcionando?

---

## 📈 Próximas Melhorias

- [ ] Cache de dados com React Query
- [ ] Refresh automático a cada X minutos
- [ ] Gráficos mais avançados (Chart.js)
- [ ] Exportar relatórios em PDF
- [ ] Filtros avançados de data
- [ ] WebSocket para dados em tempo real
- [ ] Notificações de novas reservas

---

## 🎉 Resultado Final

✅ **Dashboard 100% integrado com sua API!**
✅ **Dados reais sendo exibidos**
✅ **Mapeamento automático PT/EN**
✅ **Loading e error states**
✅ **Proteção por autenticação**
✅ **Design moderno e responsivo**

**Agora é só usar e aproveitar! 🚀**

---

**Última atualização**: 2025
**Versão**: 1.0.0

