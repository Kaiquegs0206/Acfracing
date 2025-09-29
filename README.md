# Oficina Automotiva - Jogo 2D

Um protótipo jogável de um jogo 2D de mecânica e desempenho automotivo desenvolvido com Phaser 3.

## 🎮 Visão Geral

Você administra uma oficina automotiva onde pode:
- Comprar carros no ferro-velho
- Restaurar e modificar veículos
- Testar carros na pista
- Vender carros por lucro

## 🚀 Como Executar

### 🌐 Versão Online (Recomendado)
**Jogue diretamente no navegador**: [https://acfracing.vercel.app](https://acfracing.vercel.app)

### 💻 Executar Localmente

#### Opção 1: Servidor Python (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Opção 2: Node.js serve
```bash
npx serve .
```

#### Opção 3: Live Server (VS Code)
Instale a extensão "Live Server" e clique com botão direito no `index.html` → "Open with Live Server"

#### Acesso Local
Abra seu navegador e acesse:
- `http://localhost:8000` (Python)
- `http://localhost:3000` (serve)

### 🚀 Deploy Automático
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

## 📁 Estrutura do Projeto

```
/
├── index.html              # Página principal
├── README.md               # Este arquivo
├── sample_cars.json        # Dados dos carros de exemplo
├── assets/                 # Imagens e recursos
│   ├── car_01.png         # Sprite do carro 1
│   ├── car_02.png         # Sprite do carro 2
│   └── ui/                # Interface do usuário
│       ├── button.png
│       └── panel.png
└── src/                   # Código fonte
    ├── main.js            # Ponto de entrada
    ├── scenes/            # Cenas do jogo
    │   ├── WorkshopScene.js
    │   ├── JunkyardScene.js
    │   └── TestTrackScene.js
    ├── game/              # Lógica do jogo
    │   └── carManager.js
    ├── ui/                # Interface
    │   ├── UIManager.js
    │   └── ModalManager.js
    └── utils/             # Utilitários
        └── saveManager.js
```

## 🎯 Funcionalidades

### Oficina (Garagem)
- Visualizar carros comprados
- Restaurar condição dos veículos
- Modificar peças (motor, pneus, suspensão)
- Vender carros

### Ferro-velho
- Comprar carros usados
- Visualizar estatísticas e condição
- Gerenciar orçamento

### Pista de Teste
- Dirigir carros com física realista
- Controles: Setas/WASD + Espaço (freio de mão)
- Performance afetada por upgrades

## 🔧 Mecânicas do Jogo

### Atributos dos Carros
- **Condição**: 0-100% (afeta performance)
- **Velocidade Máxima**: Base + upgrades de motor
- **Aceleração**: Base + upgrades de motor
- **Manuseio**: Base + upgrades de pneus

### Fórmulas de Performance
```javascript
topSpeed = baseTopSpeed * (1 + 0.08 * (engineLevel-1)) * (condition/100)
acceleration = baseAcceleration * (1 + 0.12 * (engineLevel-1)) * (condition/100)
handling = baseHandling * (1 + 0.06 * (tiresLevel-1)) * (condition/100)
```

### Custos
- **Restauração**: `((100 - condition) * price_base / 100) * 0.8`
- **Upgrade de Motor**: `price_base * 0.1 * engineLevelIncrement`
- **Venda**: `buy_price * (condition/100) * (1 + 0.05 * totalUpgrades)`

## 🎮 Controles

### Desktop
- **Setas** ou **WASD**: Direção
- **Espaço**: Freio de mão
- **Mouse**: Interface

### Mobile
- Botões virtuais na tela
- Toque para interface

## 💾 Sistema de Salvamento

O jogo salva automaticamente:
- Orçamento atual
- Carros na garagem
- Upgrades aplicados

Dados salvos em `localStorage` do navegador.

## 🎨 Personalização de Assets

### Substituir Sprites
1. Coloque suas imagens na pasta `assets/`
2. Mantenha os nomes dos arquivos
3. Formatos suportados: PNG, JPG, GIF

### Adicionar Novos Carros
1. Edite `sample_cars.json`
2. Adicione sprites em `assets/`
3. Reinicie o jogo

### Exemplo de Carro no JSON:
```json
{
  "id": "car_01",
  "name": "Fusca 1970",
  "image": "car_01.png",
  "price_base": 5000,
  "buy_price": 2000,
  "condition": 45,
  "baseTopSpeed": 120,
  "baseAcceleration": 8,
  "baseHandling": 6,
  "engineLevel": 1,
  "tiresLevel": 1,
  "suspensionLevel": 1,
  "paint": "#FF0000"
}
```

## 🧪 Roteiro de Testes

### Teste Básico
1. ✅ Abrir o jogo no navegador
2. ✅ Verificar carregamento sem erros no console
3. ✅ Navegar entre as cenas (Oficina, Ferro-velho, Pista)

### Teste de Compra
1. ✅ Ir ao Ferro-velho
2. ✅ Comprar um carro (orçamento deve diminuir)
3. ✅ Verificar se carro aparece na Oficina

### Teste de Modificação
1. ✅ Na Oficina, clicar em "Modificar"
2. ✅ Aplicar upgrades (motor, pneus, suspensão)
3. ✅ Verificar mudança nos stats e custo

### Teste de Restauração
1. ✅ Clicar em "Restaurar" em um carro
2. ✅ Confirmar restauração
3. ✅ Verificar aumento da condição e redução do orçamento

### Teste de Venda
1. ✅ Clicar em "Vender" em um carro
2. ✅ Confirmar venda
3. ✅ Verificar recebimento do dinheiro e remoção do carro

### Teste da Pista
1. ✅ Ir à Pista de Teste
2. ✅ Selecionar um carro
3. ✅ Usar controles (setas/WASD)
4. ✅ Verificar física e performance

### Teste de Persistência
1. ✅ Fazer algumas ações (comprar, modificar)
2. ✅ Recarregar a página (F5)
3. ✅ Verificar se dados foram mantidos

## 🐛 Solução de Problemas

### Erro de CORS
- Use um servidor local (não abra o arquivo diretamente)
- Execute um dos comandos na seção "Como Executar"

### Assets não carregam
- Verifique se as imagens estão na pasta `assets/`
- Confirme os nomes dos arquivos
- Use formatos suportados (PNG, JPG)

### Performance lenta
- Reduza o número de carros na garagem
- Feche outras abas do navegador
- Use um navegador mais recente

## 🔮 Extensões Futuras

### Funcionalidades Adicionais
- Sistema de missões
- Multiplayer local
- Mais tipos de upgrades
- Sistema de reputação
- Clientes com pedidos específicos

### Melhorias Técnicas
- TypeScript
- Sistema de build
- Testes automatizados
- PWA (Progressive Web App)

## 📝 Licença

Este projeto é um protótipo educacional. Sinta-se livre para usar e modificar.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Phaser 3**




