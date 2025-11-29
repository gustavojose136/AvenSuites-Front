#!/usr/bin/env node

/**
 * Script para validar cobertura de testes
 * Verifica se a cobertura está acima de 20%
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_THRESHOLD = 20;

function readCoverageSummary() {
  const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
  
  if (!fs.existsSync(coveragePath)) {
    console.error('❌ Arquivo de cobertura não encontrado. Execute: npm run test:coverage');
    process.exit(1);
  }

  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  return coverage.total;
}

function checkCoverage() {
  console.log('\n📊 Verificando cobertura de testes...\n');
  
  const coverage = readCoverageSummary();
  
  const metrics = {
    lines: coverage.lines.pct,
    statements: coverage.statements.pct,
    functions: coverage.functions.pct,
    branches: coverage.branches.pct,
  };

  console.log('📈 Cobertura atual:');
  console.log(`   Linhas:        ${metrics.lines.toFixed(2)}%`);
  console.log(`   Statements:    ${metrics.statements.toFixed(2)}%`);
  console.log(`   Funções:       ${metrics.functions.toFixed(2)}%`);
  console.log(`   Branches:      ${metrics.branches.toFixed(2)}%\n`);

  const allPassed = Object.values(metrics).every(value => value >= COVERAGE_THRESHOLD);

  if (allPassed) {
    console.log(`✅ Cobertura acima de ${COVERAGE_THRESHOLD}% em todas as métricas!\n`);
    process.exit(0);
  } else {
    console.log(`❌ Cobertura abaixo de ${COVERAGE_THRESHOLD}% em algumas métricas:\n`);
    
    Object.entries(metrics).forEach(([metric, value]) => {
      if (value < COVERAGE_THRESHOLD) {
        console.log(`   ⚠️  ${metric}: ${value.toFixed(2)}% (mínimo: ${COVERAGE_THRESHOLD}%)`);
      }
    });
    
    console.log('\n💡 Dica: Adicione mais testes para aumentar a cobertura.\n');
    process.exit(1);
  }
}

checkCoverage();

