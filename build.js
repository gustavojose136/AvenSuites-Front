// Script para build com suporte a certificados SSL auto-assinados
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { execSync } = require('child_process');

console.log('Iniciando build com NODE_TLS_REJECT_UNAUTHORIZED=0...');
execSync('next build', { stdio: 'inherit' });

