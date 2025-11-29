# 🧪 Guia de Testes Automatizados

Este documento explica como executar e validar os testes automatizados do projeto, garantindo 20% de cobertura de código.

## 📋 Índice

- [Executando Testes](#executando-testes)
- [Validação de Cobertura](#validação-de-cobertura)
- [Estrutura de Testes](#estrutura-de-testes)
- [Como Validar 20% de Cobertura](#como-validar-20-de-cobertura)
- [CI/CD](#cicd)

## 🚀 Executando Testes

### Testes Básicos

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa ao salvar arquivos)
npm run test:watch
```

### Testes com Cobertura

```bash
# Executar testes e gerar relatório de cobertura
npm run test:coverage

# Verificar se a cobertura está acima de 20%
npm run test:coverage:check

# Executar testes no CI (modo otimizado)
npm run test:ci
```

## 📊 Validação de Cobertura

### Requisitos de Cobertura

O projeto exige **mínimo de 20% de cobertura** nas seguintes métricas:

- **Branches**: 20%
- **Functions**: 20%
- **Lines**: 20%
- **Statements**: 20%

### Verificar Cobertura Manualmente

Após executar `npm run test:coverage`, você pode:

1. **Ver no terminal**: O Jest exibe um resumo da cobertura
2. **Abrir relatório HTML**: Abra `coverage/lcov-report/index.html` no navegador
3. **Usar script de validação**: Execute `node scripts/check-coverage.js`

### Script de Validação

```bash
# Executar validação de cobertura
node scripts/check-coverage.js
```

Este script:
- ✅ Verifica se todas as métricas estão acima de 20%
- ✅ Exibe um resumo colorido no terminal
- ✅ Retorna código de saída 0 (sucesso) ou 1 (falha)

## 📁 Estrutura de Testes

Os testes seguem a estrutura do projeto:

```
src/
├── domain/
│   └── services/
│       └── __tests__/          # Testes de serviços de domínio
├── infrastructure/
│   └── api/
│       └── repositories/
│           └── __tests__/      # Testes de repositórios
├── presentation/
│   └── hooks/
│       └── __tests__/          # Testes de hooks
├── shared/
│   ├── hooks/
│   │   └── __tests__/          # Testes de hooks compartilhados
│   ├── utils/
│   │   └── __tests__/          # Testes de utilitários
│   └── validators/
│       └── __tests__/          # Testes de validadores
└── utils/
    └── __tests__/              # Testes de utilitários gerais
```

### Padrão de Nomenclatura

- Arquivos de teste: `*.test.ts` ou `*.test.tsx`
- Localização: Pasta `__tests__` ao lado do arquivo testado

## ✅ Como Validar 20% de Cobertura

### Passo a Passo

1. **Execute os testes com cobertura:**
   ```bash
   npm run test:coverage
   ```

2. **Verifique o output no terminal:**
   ```
   ------------------|---------|----------|---------|---------|
   File               | % Stmts | % Branch | % Funcs | % Lines |
   ------------------|---------|----------|---------|---------|
   All files          |   25.5  |   22.1   |   24.3  |   25.5  |
   ------------------|---------|----------|---------|---------|
   ```

3. **Valide usando o script:**
   ```bash
   node scripts/check-coverage.js
   ```

4. **Abra o relatório HTML (opcional):**
   ```bash
   # No Windows
   start coverage/lcov-report/index.html

   # No Linux/Mac
   open coverage/lcov-report/index.html
   ```

### O que é Testado

Atualmente, os testes cobrem:

- ✅ **Utilitários**: `jwtHelper`, `authHelper`, `guestMapper`, `validateEmail`
- ✅ **Validadores**: `guestSchema`, `hotelSchema`, `roomSchema`
- ✅ **Serviços de Domínio**: `AuthService`, `BookingService`, `HotelService`
- ✅ **Hooks**: `useBooking`, `usePagination`, `useResponsiveItemsPerPage`
- ✅ **Repositórios**: `HotelRepository`
- ✅ **Componentes**: `BookingCard`, `BookingForm`

### Arquivos Excluídos da Cobertura

Os seguintes arquivos são **intencionalmente excluídos** da cobertura:

- `src/app/**` - Páginas Next.js (testadas manualmente)
- `src/components/**` - Componentes de UI (testados manualmente)
- `src/types/**` - Definições de tipos TypeScript
- Arquivos `.d.ts` - Definições de tipos

## 🔄 CI/CD

### GitHub Actions

O projeto possui um workflow automático que:

1. Executa testes em cada PR e push
2. Valida se a cobertura está acima de 20%
3. Faz upload do relatório de cobertura como artifact
4. Comenta no PR com o status da cobertura

**Arquivo**: `.github/workflows/test-coverage.yml`

### Integração no Build

Para garantir que o build falhe se a cobertura estiver abaixo de 20%, adicione ao seu workflow:

```yaml
- name: Check coverage threshold
  run: npm run test:coverage:check
```

## 📈 Melhorando a Cobertura

### Dicas

1. **Foque em código crítico primeiro**: Serviços, utilitários e validadores
2. **Teste casos de sucesso e erro**: Valide tanto caminhos felizes quanto exceções
3. **Use mocks adequadamente**: Isole dependências externas
4. **Mantenha testes simples**: Um teste deve verificar uma coisa

### Exemplo de Teste

```typescript
describe('MinhaFuncao', () => {
  it('deve fazer algo quando recebe entrada válida', () => {
    const resultado = minhaFuncao('entrada válida');
    expect(resultado).toBe('resultado esperado');
  });

  it('deve lançar erro quando recebe entrada inválida', () => {
    expect(() => minhaFuncao('')).toThrow('Erro esperado');
  });
});
```

## 🐛 Troubleshooting

### Erro: "Coverage threshold not met"

**Solução**: Adicione mais testes ou ajuste o threshold no `jest.config.js`

### Erro: "Cannot find module"

**Solução**: Verifique se o caminho do módulo está correto no `moduleNameMapper` do `jest.config.js`

### Testes muito lentos

**Solução**: Use `npm run test:ci` que otimiza para CI/CD

## 📚 Recursos

- [Documentação Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)

## ✅ Checklist de Validação

Antes de fazer commit, certifique-se de:

- [ ] Todos os testes passam: `npm test`
- [ ] Cobertura está acima de 20%: `npm run test:coverage:check`
- [ ] Novos arquivos têm testes correspondentes
- [ ] Testes seguem o padrão de nomenclatura

---

**Última atualização**: Janeiro 2025

