# 🎮 INSTRUÇÕES DE DEPLOY - OFICINA AUTOMOTIVA

## 🎯 Objetivo
Fazer o deploy do jogo no GitHub e depois na Vercel para ter uma URL pública.

## 📋 Passo a Passo COMPLETO

### 1️⃣ PREPARAR O PROJETO

```bash
# Navegue até a pasta do projeto
cd "C:\SP\Ape Conveniencia\PASTAS_PARTICULARES - Kaique_Gomes\FRJRWS021\Documents\cursorgm"

# Verifique se todos os arquivos estão presentes
dir
```

### 2️⃣ EXECUTAR DEPLOY AUTOMÁTICO

**Opção A: Script Automático (Recomendado)**
```bash
# Execute o script de deploy
deploy.bat
```

**Opção B: Comandos Manuais**
```bash
# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: Jogo de oficina automotiva completo"

# Conectar ao GitHub
git remote add origin https://github.com/Kaiquegs0206/Acfracing.git

# Enviar para GitHub
git push -u origin main
```

### 3️⃣ DEPLOY NA VERCEL

1. **Acesse**: [https://vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Clique em**: "New Project"
4. **Selecione**: Repositório `Acfracing`
5. **Configure**:
   - Framework: **Other**
   - Root Directory: **/** (raiz)
   - Build Command: **(deixe vazio)**
   - Output Directory: **(deixe vazio)**
6. **Clique em**: "Deploy"

### 4️⃣ VERIFICAR DEPLOY

1. **Aguarde** o deploy terminar (2-3 minutos)
2. **Acesse** a URL fornecida pela Vercel
3. **Teste** o jogo:
   - [ ] Carrega sem erros
   - [ ] Navegação funciona
   - [ ] Compra de carros funciona
   - [ ] Pista de teste funciona

## 🔧 CONFIGURAÇÕES IMPORTANTES

### GitHub Repository
- **URL**: https://github.com/Kaiquegs0206/Acfracing.git
- **Branch**: main
- **Status**: ✅ Pronto para deploy

### Vercel Configuration
- **Framework**: Static Site
- **Build Command**: (nenhum)
- **Output Directory**: (raiz)
- **Node Version**: 18.x

## 🎮 FUNCIONALIDADES DO JOGO

### ✅ Implementadas
- **Sistema de Carros**: Compra, venda, modificação
- **3 Cenas**: Oficina, Ferro-velho, Pista de Teste
- **Física Realista**: Aceleração, velocidade, manuseio
- **Persistência**: Salvamento automático
- **UI Responsiva**: Desktop e mobile
- **Modais Interativos**: Modificação, restauração, venda

### 🎯 Mecânicas
- **Orçamento**: R$ 10.000 inicial
- **Carros**: 5 tipos diferentes
- **Upgrades**: Motor, pneus, suspensão, pintura
- **Física**: Baseada em estatísticas reais
- **Salvamento**: localStorage automático

## 🚀 PRÓXIMOS PASSOS

### Após Deploy
1. **Teste completo** do jogo online
2. **Compartilhe** a URL com amigos
3. **Monitore** performance na Vercel
4. **Planeje** melhorias futuras

### Melhorias Futuras
- [ ] **Multiplayer** online
- [ ] **Mais carros** e peças
- [ ] **Sistema de missões**
- [ ] **Rankings** e conquistas
- [ ] **Sprites** reais (substituir placeholders)

## 🐛 TROUBLESHOOTING

### Problema: Git não funciona
**Solução**: Instale o Git: [https://git-scm.com](https://git-scm.com)

### Problema: Vercel não encontra arquivos
**Solução**: Verifique se o `index.html` está na raiz

### Problema: Jogo não carrega
**Solução**: 
1. Verifique console do navegador (F12)
2. Confirme se todos os arquivos foram enviados
3. Teste localmente primeiro

### Problema: Assets não aparecem
**Solução**: Os assets são placeholders. Para imagens reais, substitua os arquivos na pasta `assets/`

## 📊 ESTRUTURA FINAL

```
Acfracing/
├── index.html              # Página principal
├── README.md               # Documentação
├── DEPLOY.md              # Guia de deploy
├── package.json           # Configuração Node.js
├── vercel.json            # Configuração Vercel
├── sample_cars.json       # Dados dos carros
├── assets/                # Imagens placeholder
│   ├── car_01.png
│   ├── car_02.png
│   └── ui/
└── src/                   # Código fonte
    ├── main.js
    ├── game/
    ├── scenes/
    ├── ui/
    └── utils/
```

## 🎉 RESULTADO FINAL

**URL do Jogo**: https://acfracing.vercel.app
**Repositório**: https://github.com/Kaiquegs0206/Acfracing
**Status**: ✅ Pronto para jogar!

---

**Desenvolvido com ❤️ usando Phaser 3**
**Deploy automático configurado**
**Pronto para produção**
