# 🚀 Guia de Deploy - Oficina Automotiva

## 📋 Pré-requisitos

- Git instalado
- Conta no GitHub
- Conta na Vercel
- Node.js (opcional, para testes locais)

## 🔧 Passo a Passo para Deploy

### 1. Preparar o Repositório Local

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "feat: Implementação inicial do jogo de oficina automotiva

- Sistema completo de gerenciamento de carros
- 3 cenas: Oficina, Ferro-velho, Pista de Teste
- Física realista com Phaser 3
- Sistema de persistência com localStorage
- UI responsiva e modais interativos
- Assets placeholder incluídos"

# Conectar ao repositório remoto
git remote add origin https://github.com/Kaiquegs0206/Acfracing.git

# Enviar para o GitHub
git push -u origin main
```

### 2. Deploy na Vercel

#### Opção A: Deploy via GitHub (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `Acfracing`
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `/` (raiz)
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)
6. Clique em "Deploy"

#### Opção B: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### 3. Configurações da Vercel

O arquivo `vercel.json` já está configurado com:
- ✅ Roteamento para SPA
- ✅ Headers de cache otimizados
- ✅ Configuração para arquivos estáticos

### 4. Domínio Personalizado (Opcional)

1. Na dashboard da Vercel, vá em "Settings"
2. Clique em "Domains"
3. Adicione seu domínio personalizado
4. Configure os DNS conforme instruções

## 🧪 Testando o Deploy

### Teste Local
```bash
# Instalar dependências
npm install

# Executar servidor local
npm start

# Acessar: http://localhost:3000
```

### Teste na Vercel
1. Acesse a URL fornecida pela Vercel
2. Teste todas as funcionalidades:
   - [ ] Navegação entre cenas
   - [ ] Compra de carros
   - [ ] Modificação de carros
   - [ ] Teste na pista
   - [ ] Salvamento automático

## 🔄 Atualizações Futuras

### Para atualizar o jogo:

```bash
# Fazer mudanças no código
# ...

# Commit das mudanças
git add .
git commit -m "feat: Nova funcionalidade X"

# Push para GitHub
git push origin main

# A Vercel fará deploy automático!
```

### Deploy Manual (se necessário):
```bash
vercel --prod
```

## 📊 Monitoramento

### Vercel Analytics
- Acesse a dashboard da Vercel
- Veja métricas de performance
- Monitore erros em tempo real

### GitHub Actions (Opcional)
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Problema: Assets não carregam
**Solução**: Verifique se os arquivos estão na pasta `assets/`

### Problema: CORS errors
**Solução**: A Vercel serve arquivos estáticos corretamente

### Problema: Performance lenta
**Solução**: 
- Otimize as imagens
- Use CDN da Vercel
- Configure cache headers

### Problema: Deploy falha
**Solução**:
```bash
# Verificar logs
vercel logs

# Redeploy
vercel --prod --force
```

## 📈 Otimizações Futuras

### Performance
- [ ] Lazy loading de assets
- [ ] Compressão de imagens
- [ ] Service Worker para cache

### Funcionalidades
- [ ] Multiplayer
- [ ] Sistema de conquistas
- [ ] Mais tipos de carros
- [ ] Sistema de missões

### SEO
- [ ] Meta tags otimizadas
- [ ] Sitemap
- [ ] Analytics

## 🎯 Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Deploy na Vercel realizado
- [ ] URL funcionando
- [ ] Todas as funcionalidades testadas
- [ ] Performance aceitável
- [ ] Mobile responsivo
- [ ] Console sem erros

## 📞 Suporte

- **GitHub Issues**: Para bugs e features
- **Vercel Support**: Para problemas de deploy
- **Documentação**: README.md e TESTE.md

---

**Status**: ✅ Pronto para Deploy
**URL de Produção**: https://acfracing.vercel.app
**Última Atualização**: 29/09/2025
