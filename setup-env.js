#!/usr/bin/env node

/**
 * Script auxiliar para configurar as variáveis de ambiente
 * Uso: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n🚀 Configuração do AvenSuites Frontend\n');
  console.log('Este script irá ajudá-lo a configurar as variáveis de ambiente.\n');

  const envPath = path.join(__dirname, '.env.local');
  
  // Verificar se já existe
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  O arquivo .env.local já existe. Deseja sobrescrever? (s/N): ');
    if (overwrite.toLowerCase() !== 's') {
      console.log('\n✅ Mantendo arquivo existente. Até logo!');
      rl.close();
      return;
    }
  }

  console.log('\n📝 Configuração da API Externa\n');
  
  // API URL
  const apiUrl = await question('URL da API (padrão: https://localhost:7000/api): ') || 'https://localhost:7000/api';
  
  // Frontend URL
  const frontendUrl = await question('URL do Frontend (padrão: http://localhost:3000): ') || 'http://localhost:3000';
  
  // Gerar NEXTAUTH_SECRET
  console.log('\n🔐 Gerando chave secreta...');
  let secret;
  try {
    secret = execSync('openssl rand -base64 32').toString().trim();
    console.log('✅ Chave gerada com sucesso!');
  } catch (error) {
    console.log('⚠️  Não foi possível gerar automaticamente. Usando chave padrão.');
    secret = 'CHANGE-THIS-SECRET-IN-PRODUCTION-' + Date.now();
  }

  // Criar conteúdo do .env.local
  const envContent = `# ============================================
# API EXTERNA - AVENSUITES BACKEND
# ============================================
NEXT_PUBLIC_API_URL=${apiUrl}

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
NEXTAUTH_URL=${frontendUrl}
NEXTAUTH_SECRET=${secret}

# ============================================
# OAUTH PROVIDERS (OPCIONAL)
# ============================================
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ============================================
# EMAIL PROVIDER (OPCIONAL)
# ============================================
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=

# ============================================
# DATABASE (SE USAR PRISMA LOCALMENTE)
# ============================================
DATABASE_URL=

# Arquivo gerado em: ${new Date().toLocaleString('pt-BR')}
`;

  // Escrever arquivo
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Arquivo .env.local criado com sucesso!\n');
  console.log('📋 Configuração:\n');
  console.log(`   API URL: ${apiUrl}`);
  console.log(`   Frontend URL: ${frontendUrl}`);
  console.log(`   Secret: ${secret.substring(0, 20)}...`);
  
  console.log('\n🎯 Próximos passos:\n');
  console.log('   1. Verifique se sua API está rodando');
  console.log('   2. Execute: npm install');
  console.log('   3. Execute: npm run dev');
  console.log('   4. Acesse: ' + frontendUrl);
  console.log('   5. Teste o login em: ' + frontendUrl + '/signin');
  
  console.log('\n📚 Documentação completa: GUIA_CONFIGURACAO_API.md\n');
  
  rl.close();
}

main().catch(error => {
  console.error('\n❌ Erro:', error.message);
  rl.close();
  process.exit(1);
});

