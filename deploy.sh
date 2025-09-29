#!/bin/bash

echo "========================================"
echo "  DEPLOY AUTOMATICO - OFICINA AUTOMOTIVA"
echo "========================================"
echo

echo "[1/4] Verificando arquivos..."
if [ ! -f "index.html" ]; then
    echo "ERRO: index.html não encontrado!"
    exit 1
fi

if [ ! -f "src/main.js" ]; then
    echo "ERRO: src/main.js não encontrado!"
    exit 1
fi

echo "[2/4] Inicializando Git..."
git init
git add .
git status

echo
echo "[3/4] Fazendo commit..."
git commit -m "feat: Jogo de oficina automotiva completo

- Sistema de gerenciamento de carros
- 3 cenas: Oficina, Ferro-velho, Pista
- Física realista com Phaser 3
- Persistência com localStorage
- UI responsiva e modais
- Assets placeholder incluídos
- Pronto para deploy na Vercel"

echo
echo "[4/4] Conectando ao GitHub..."
git remote add origin https://github.com/Kaiquegs0206/Acfracing.git
git branch -M main
git push -u origin main

echo
echo "========================================"
echo "  DEPLOY CONCLUÍDO COM SUCESSO!"
echo "========================================"
echo
echo "Próximos passos:"
echo "1. Acesse: https://github.com/Kaiquegs0206/Acfracing"
echo "2. Vá para: https://vercel.com"
echo "3. Importe o repositório"
echo "4. Deploy automático!"
echo
echo "URL do jogo: https://acfracing.vercel.app"
echo
