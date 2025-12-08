#!/usr/bin/env node

/**
 * Script para validar cobertura de testes
 * Verifica se a cobertura está acima dos thresholds mínimos
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_THRESHOLDS = {
  statements: 25,
  branches: 20,
  functions: 25,
  lines: 25,
};

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
  console.log(`   Statements:    ${metrics.statements.toFixed(2)}% (mínimo: ${COVERAGE_THRESHOLDS.statements}%)`);
  console.log(`   Branches:      ${metrics.branches.toFixed(2)}% (mínimo: ${COVERAGE_THRESHOLDS.branches}%)`);
  console.log(`   Functions:     ${metrics.functions.toFixed(2)}% (mínimo: ${COVERAGE_THRESHOLDS.functions}%)`);
  console.log(`   Lines:         ${metrics.lines.toFixed(2)}% (mínimo: ${COVERAGE_THRESHOLDS.lines}%)\n`);

  const results = {
    statements: metrics.statements >= COVERAGE_THRESHOLDS.statements,
    branches: metrics.branches >= COVERAGE_THRESHOLDS.branches,
    functions: metrics.functions >= COVERAGE_THRESHOLDS.functions,
    lines: metrics.lines >= COVERAGE_THRESHOLDS.lines,
  };

  const allPassed = Object.values(results).every(passed => passed);

  if (allPassed) {
    console.log('✅ Cobertura acima dos thresholds mínimos em todas as métricas!\n');
    process.exit(0);
  } else {
    console.log('❌ Cobertura abaixo dos thresholds mínimos em algumas métricas:\n');
    
    Object.entries(results).forEach(([metric, passed]) => {
      if (!passed) {
        const value = metrics[metric];
        const threshold = COVERAGE_THRESHOLDS[metric];
        console.log(`   ⚠️  ${metric}: ${value.toFixed(2)}% (mínimo: ${threshold}%)`);
      } else {
        const value = metrics[metric];
        console.log(`   ✅ ${metric}: ${value.toFixed(2)}%`);
      }
    });
    
    console.log('\n💡 Dica: Adicione mais testes para aumentar a cobertura.\n');
    process.exit(1);
  }
}

checkCoverage();

