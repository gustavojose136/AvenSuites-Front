# 📚 Índice da Documentação - AvenSuites Frontend

## 📖 Guia de Leitura Recomendado

### Para Começar Rapidamente 🚀
1. **[README_FRONTEND.md](README_FRONTEND.md)** 
   - Visão geral do projeto
   - Como executar
   - Stack tecnológica

2. **[IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)**
   - Resumo executivo de tudo que foi implementado
   - Estatísticas e métricas
   - Status final

3. **[EXEMPLOS_USO.md](EXEMPLOS_USO.md)**
   - Exemplos práticos de código
   - Como usar cada módulo
   - Boas práticas

### Para Entender a Arquitetura 🏗️
4. **[CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)**
   - Conceitos de Clean Architecture
   - Camadas e responsabilidades
   - Princípios SOLID explicados

5. **[ARQUITETURA_IMPLEMENTADA.md](ARQUITETURA_IMPLEMENTADA.md)**
   - Estrutura detalhada implementada
   - Arquivos e suas funções
   - Padrões de design utilizados

### Para Integrar com o Backend 🔌
6. **[INTEGRACAO_API.md](INTEGRACAO_API.md)**
   - Como configurar a integração
   - Solução de problemas SSL
   - Exemplos de requisições

### Para Continuar o Desenvolvimento 💻
7. **[GUIA_CONTINUACAO.md](GUIA_CONTINUACAO.md)**
   - Próximos passos detalhados
   - Funcionalidades pendentes
   - Checklist completo

8. **[TEMPLATES_COMPONENTES.md](TEMPLATES_COMPONENTES.md)**
   - Templates para novos componentes
   - Estrutura de formulários
   - Exemplos de páginas

9. **[PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)**
   - Roadmap detalhado
   - Prioridades
   - Estimativas de trabalho

### Para Referência Rápida 📋
10. **[RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md)**
    - Resumo do que foi feito
    - O que falta fazer
    - Estrutura do projeto

---

## 📂 Documentos por Categoria

### 🎯 Visão Geral
- [README_FRONTEND.md](README_FRONTEND.md) - Documento principal
- [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md) - Status completo
- [RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md) - Resumo executivo

### 🏗️ Arquitetura
- [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md) - Conceitos
- [ARQUITETURA_IMPLEMENTADA.md](ARQUITETURA_IMPLEMENTADA.md) - Implementação

### 💡 Guias Práticos
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md) - Exemplos de código
- [TEMPLATES_COMPONENTES.md](TEMPLATES_COMPONENTES.md) - Templates
- [INTEGRACAO_API.md](INTEGRACAO_API.md) - Integração

### 🚀 Desenvolvimento
- [GUIA_CONTINUACAO.md](GUIA_CONTINUACAO.md) - Próximos passos
- [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md) - Roadmap

---

## 🔍 Busca Rápida por Tópico

### Autenticação
- [INTEGRACAO_API.md](INTEGRACAO_API.md) → Seção "Configuração de Autenticação"
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md) → Seção "5. Trabalhando com Autenticação"
- `src/utils/auth.ts` → Implementação NextAuth

### Hotéis
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md) → Seção "1. Trabalhando com Hotéis"
- `src/domain/services/IHotelService.ts` → Interface do serviço
- `src/presentation/hooks/useHotel.ts` → Hook customizado
- `src/presentation/components/Hotel/HotelList.tsx` → Componente de lista

### Quartos
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md) → Seção "2. Trabalhando com Quartos"
- `src/domain/services/IRoomService.ts` → Interface do serviço
- `src/presentation/hooks/useRoom.ts` → Hook customizado
- `src/presentation/components/Room/RoomList.tsx` → Componente de lista

### Reservas
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md) → Seção "3. Trabalhando com Reservas"
- `src/domain/services/IBookingService.ts` → Interface do serviço
- `src/presentation/hooks/useBooking.ts` → Hook customizado
- `src/presentation/components/Booking/BookingList.tsx` → Componente de lista

### Hóspedes
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md) → Seção "4. Trabalhando com Hóspedes"
- `src/domain/services/IGuestService.ts` → Interface do serviço
- `src/presentation/hooks/useGuest.ts` → Hook customizado

### Dependency Injection
- [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md) → Seção "Dependency Injection"
- `src/shared/di/Container.ts` → Implementação do container

### DTOs
- [ARQUITETURA_IMPLEMENTADA.md](ARQUITETURA_IMPLEMENTADA.md) → Seção "Application Layer"
- `src/application/dto/` → Todos os DTOs

### Componentes
- [TEMPLATES_COMPONENTES.md](TEMPLATES_COMPONENTES.md) → Templates completos
- `src/presentation/components/` → Componentes implementados

---

## 📝 Checklist de Leitura

### Para Desenvolvedores Novos no Projeto
- [ ] Ler [README_FRONTEND.md](README_FRONTEND.md)
- [ ] Ler [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)
- [ ] Ler [EXEMPLOS_USO.md](EXEMPLOS_USO.md)
- [ ] Configurar ambiente seguindo [INTEGRACAO_API.md](INTEGRACAO_API.md)
- [ ] Testar exemplos práticos

### Para Continuar o Desenvolvimento
- [ ] Revisar [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)
- [ ] Consultar [GUIA_CONTINUACAO.md](GUIA_CONTINUACAO.md)
- [ ] Usar templates em [TEMPLATES_COMPONENTES.md](TEMPLATES_COMPONENTES.md)
- [ ] Seguir [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)

### Para Arquitetos/Tech Leads
- [ ] Analisar [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)
- [ ] Revisar [ARQUITETURA_IMPLEMENTADA.md](ARQUITETURA_IMPLEMENTADA.md)
- [ ] Validar [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)
- [ ] Planejar usando [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)

---

## 🎯 Perguntas Frequentes (FAQ)

### "Como eu começo?"
→ Leia [README_FRONTEND.md](README_FRONTEND.md) primeiro

### "Como usar os serviços?"
→ Veja [EXEMPLOS_USO.md](EXEMPLOS_USO.md)

### "O que é Clean Architecture?"
→ Consulte [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)

### "O que já foi implementado?"
→ Veja [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)

### "O que falta fazer?"
→ Consulte [GUIA_CONTINUACAO.md](GUIA_CONTINUACAO.md)

### "Como criar um novo componente?"
→ Use templates em [TEMPLATES_COMPONENTES.md](TEMPLATES_COMPONENTES.md)

### "Como integrar com a API?"
→ Siga [INTEGRACAO_API.md](INTEGRACAO_API.md)

### "Qual o próximo passo?"
→ Leia [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)

---

## 📊 Documentos por Tamanho

### Rápidos (< 5 min) ⚡
- [RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md)
- [INDICE_DOCUMENTACAO.md](INDICE_DOCUMENTACAO.md) (este arquivo)

### Médios (5-15 min) 📖
- [README_FRONTEND.md](README_FRONTEND.md)
- [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)
- [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)
- [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)

### Completos (15-30 min) 📚
- [ARQUITETURA_IMPLEMENTADA.md](ARQUITETURA_IMPLEMENTADA.md)
- [EXEMPLOS_USO.md](EXEMPLOS_USO.md)
- [GUIA_CONTINUACAO.md](GUIA_CONTINUACAO.md)
- [TEMPLATES_COMPONENTES.md](TEMPLATES_COMPONENTES.md)
- [INTEGRACAO_API.md](INTEGRACAO_API.md)

---

## 🗺️ Fluxo de Leitura Sugerido

```
Início
  ↓
README_FRONTEND.md (visão geral)
  ↓
IMPLEMENTACAO_COMPLETA.md (o que temos)
  ↓
┌─────────────────┐
│ Escolha seu caminho:
├→ Aprender Arquitetura → CLEAN_ARCHITECTURE.md
├→ Ver Exemplos → EXEMPLOS_USO.md
├→ Integrar API → INTEGRACAO_API.md
└→ Continuar Dev → GUIA_CONTINUACAO.md
  ↓
Use templates em TEMPLATES_COMPONENTES.md
  ↓
Siga roadmap em PROXIMOS_PASSOS.md
```

---

## 🔗 Links Rápidos

### Arquivos Principais do Código
- [Container DI](src/shared/di/Container.ts)
- [HTTP Client](src/infrastructure/http/HttpClient.ts)
- [Auth Config](src/utils/auth.ts)

### Hooks
- [useHotel](src/presentation/hooks/useHotel.ts)
- [useRoom](src/presentation/hooks/useRoom.ts)
- [useBooking](src/presentation/hooks/useBooking.ts)
- [useGuest](src/presentation/hooks/useGuest.ts)

### Componentes
- [HotelList](src/presentation/components/Hotel/HotelList.tsx)
- [RoomList](src/presentation/components/Room/RoomList.tsx)
- [BookingList](src/presentation/components/Booking/BookingList.tsx)

### Páginas
- [Hotels](src/app/(site)/hotels/page.tsx)
- [Rooms](src/app/(site)/rooms/page.tsx)
- [Bookings](src/app/(site)/bookings/page.tsx)
- [Guests](src/app/(site)/guests/page.tsx)

---

## 📞 Suporte

Para dúvidas específicas, consulte primeiro:
1. [EXEMPLOS_USO.md](EXEMPLOS_USO.md) - para código
2. [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md) - para arquitetura
3. [INTEGRACAO_API.md](INTEGRACAO_API.md) - para problemas de API

---

**Última Atualização**: 28 de Outubro de 2025
**Total de Documentos**: 11
**Status**: ✅ Documentação Completa

