# Guia de Teste - Oficina Automotiva

## 🚀 Como Executar

### Opção 1: Python (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Opção 2: Node.js
```bash
npx serve .
```

### Opção 3: Live Server (VS Code)
Instale a extensão "Live Server" e clique com botão direito no `index.html` → "Open with Live Server"

## 🧪 Roteiro de Testes

### 1. Teste de Carregamento
- [ ] Abrir o jogo no navegador
- [ ] Verificar se não há erros no console (F12)
- [ ] Verificar se a interface carrega corretamente
- [ ] Verificar se o orçamento inicial é R$ 10.000

### 2. Teste de Navegação
- [ ] Clicar em "Ferro-velho" - deve mostrar carros disponíveis
- [ ] Clicar em "Oficina" - deve mostrar garagem vazia
- [ ] Clicar em "Pista de Teste" - deve mostrar mensagem de carro não selecionado

### 3. Teste de Compra
- [ ] Ir ao Ferro-velho
- [ ] Clicar em "Comprar" em um carro
- [ ] Verificar se o orçamento diminuiu
- [ ] Verificar se o carro aparece na Oficina

### 4. Teste de Modificação
- [ ] Na Oficina, clicar em "Modificar" em um carro
- [ ] Alterar nível do motor, pneus, suspensão
- [ ] Alterar cor do carro
- [ ] Clicar em "Aplicar Modificações"
- [ ] Verificar se os custos foram deduzidos
- [ ] Verificar se as estatísticas mudaram

### 5. Teste de Restauração
- [ ] Clicar em "Restaurar" em um carro
- [ ] Confirmar a restauração
- [ ] Verificar se a condição foi para 100%
- [ ] Verificar se o custo foi deduzido

### 6. Teste de Venda
- [ ] Clicar em "Vender" em um carro
- [ ] Confirmar a venda
- [ ] Verificar se o carro foi removido da garagem
- [ ] Verificar se o dinheiro foi recebido

### 7. Teste da Pista
- [ ] Na Oficina, clicar em "Testar na Pista"
- [ ] Usar setas ou WASD para dirigir
- [ ] Usar Espaço para freio de mão
- [ ] Verificar se a física funciona
- [ ] Verificar se as estatísticas afetam a performance

### 8. Teste de Persistência
- [ ] Fazer algumas ações (comprar, modificar)
- [ ] Clicar em "Salvar"
- [ ] Recarregar a página (F5)
- [ ] Verificar se os dados foram mantidos

### 9. Teste de Reset
- [ ] Clicar em "Reset"
- [ ] Confirmar o reset
- [ ] Verificar se voltou ao estado inicial

## 🐛 Problemas Conhecidos e Soluções

### Erro de CORS
**Problema**: Não consegue carregar arquivos
**Solução**: Use um servidor local (não abra o arquivo diretamente)

### Assets não carregam
**Problema**: Imagens não aparecem
**Solução**: Os assets são placeholders. Para imagens reais, substitua os arquivos na pasta `assets/`

### Performance lenta
**Problema**: Jogo travando
**Solução**: 
- Reduza o número de carros na garagem
- Feche outras abas do navegador
- Use um navegador mais recente

### Controles não funcionam na pista
**Problema**: Carro não se move
**Solução**: 
- Verifique se a cena da pista carregou corretamente
- Use as teclas setas ou WASD
- Para mobile, use os botões de toque

## 📊 Verificações de Funcionalidade

### Fórmulas de Performance
- [ ] Velocidade máxima = baseTopSpeed * (1 + 0.08 * (engineLevel-1)) * (condition/100)
- [ ] Aceleração = baseAcceleration * (1 + 0.12 * (engineLevel-1)) * (condition/100)
- [ ] Manuseio = baseHandling * (1 + 0.06 * (tiresLevel-1)) * (condition/100)

### Custos
- [ ] Restauração = ((100 - condition) * price_base / 100) * 0.8
- [ ] Upgrade motor = price_base * 0.1 * levelIncrement
- [ ] Upgrade pneus = price_base * 0.08 * levelIncrement
- [ ] Upgrade suspensão = price_base * 0.06 * levelIncrement

### Venda
- [ ] Preço de venda = buy_price * (condition/100) * (1 + 0.05 * totalUpgrades)

## 🎯 Critérios de Aceitação

### Funcionalidades Básicas
- [ ] Jogo carrega sem erros
- [ ] Navegação entre cenas funciona
- [ ] Compra de carros funciona
- [ ] Modificação de carros funciona
- [ ] Restauração de carros funciona
- [ ] Venda de carros funciona
- [ ] Teste na pista funciona
- [ ] Salvamento funciona

### Interface
- [ ] UI responsiva
- [ ] Modais funcionam
- [ ] Notificações aparecem
- [ ] Orçamento atualiza em tempo real

### Persistência
- [ ] Dados salvos em localStorage
- [ ] Auto-save funciona
- [ ] Reset funciona
- [ ] Dados persistem após reload

## 🔧 Comandos de Debug

### Console do Navegador (F12)
```javascript
// Ver estado atual do jogo
console.log(window.gameInstance.carManager);

// Ver orçamento
console.log(window.gameInstance.carManager.budget);

// Ver garagem
console.log(window.gameInstance.carManager.garage);

// Ver histórico de transações
console.log(window.gameInstance.carManager.transactionHistory);

// Forçar salvamento
window.gameInstance.saveGame();

// Forçar reset
window.gameInstance.resetGame();
```

## 📝 Relatório de Testes

### Data do Teste: ___________
### Testador: ___________
### Navegador: ___________
### Sistema Operacional: ___________

### Resultados:
- [ ] Todos os testes passaram
- [ ] Alguns problemas encontrados (descrever abaixo)
- [ ] Problemas críticos (descrever abaixo)

### Problemas Encontrados:
1. ________________________________
2. ________________________________
3. ________________________________

### Sugestões de Melhoria:
1. ________________________________
2. ________________________________
3. ________________________________

---

**Status**: ✅ Pronto para teste
**Versão**: 1.0.0
**Última atualização**: 29/09/2025
