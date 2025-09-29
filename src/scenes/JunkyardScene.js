/**
 * JunkyardScene - Cena do ferro-velho
 * Mostra carros disponíveis para compra
 */
export class JunkyardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JunkyardScene' });
        this.carManager = null;
        this.uiManager = null;
        this.carCards = [];
    }

    init(data) {
        this.carManager = data.carManager;
        this.uiManager = data.uiManager;
    }

    create() {
        // Fundo do ferro-velho
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x2c3e50);
        this.add.text(this.scale.width / 2, 50, 'Ferro-velho', {
            fontSize: '32px',
            color: '#ecf0f1'
        }).setOrigin(0.5);

        // Área de carros disponíveis
        this.createJunkyardArea();
        
        // Atualiza a exibição dos carros
        this.updateCarDisplay();
    }

    /**
     * Cria a área do ferro-velho
     */
    createJunkyardArea() {
        const junkyardArea = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2 + 50, 
            this.scale.width - 250, 
            this.scale.height - 150, 
            0x34495e
        ).setStrokeStyle(2, 0xecf0f1);

        // Título da área
        this.add.text(junkyardArea.x, junkyardArea.y - junkyardArea.height / 2 + 20, 'Carros Disponíveis', {
            fontSize: '20px',
            color: '#ecf0f1'
        }).setOrigin(0.5);
    }

    /**
     * Atualiza a exibição dos carros disponíveis
     */
    updateCarDisplay() {
        // Remove cards antigos
        this.carCards.forEach(card => card.destroy());
        this.carCards = [];

        const availableCars = this.carManager.availableCars;
        
        if (availableCars.length === 0) {
            this.showEmptyJunkyard();
            return;
        }

        // Calcula layout da grid
        const cols = Math.min(3, availableCars.length);
        const rows = Math.ceil(availableCars.length / cols);
        const cardWidth = 220;
        const cardHeight = 280;
        const spacing = 20;
        
        const startX = 250 + (this.scale.width - 250 - (cols * cardWidth + (cols - 1) * spacing)) / 2;
        const startY = 150 + (this.scale.height - 150 - (rows * cardHeight + (rows - 1) * spacing)) / 2;

        availableCars.forEach((car, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            const x = startX + col * (cardWidth + spacing);
            const y = startY + row * (cardHeight + spacing);
            
            this.createCarCard(car, x, y, cardWidth, cardHeight);
        });
    }

    /**
     * Cria um card de carro disponível
     * @param {Object} car - Dados do carro
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura do card
     * @param {number} height - Altura do card
     */
    createCarCard(car, x, y, width, height) {
        // Fundo do card
        const cardBg = this.add.rectangle(x, y, width, height, 0x2c3e50)
            .setStrokeStyle(2, 0xecf0f1)
            .setInteractive()
            .on('pointerover', () => cardBg.setTint(0x34495e))
            .on('pointerout', () => cardBg.clearTint());

        // Imagem do carro (placeholder)
        const carImage = this.add.rectangle(x, y - 70, width - 20, 90, 0x7f8c8d)
            .setStrokeStyle(1, 0x95a5a6);
        
        // Texto placeholder da imagem
        this.add.text(x, y - 70, car.image.replace('.png', ''), {
            fontSize: '12px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        // Nome do carro
        this.add.text(x, y - 20, car.name, {
            fontSize: '14px',
            color: '#ecf0f1',
            wordWrap: { width: width - 20 }
        }).setOrigin(0.5);

        // Barra de condição
        const conditionBar = this.add.rectangle(x, y + 10, width - 20, 8, 0x34495e)
            .setStrokeStyle(1, 0x95a5a6);
        
        const conditionFill = this.add.rectangle(
            x - (width - 20) / 2 + (width - 20) * (car.condition / 100) / 2,
            y + 10,
            (width - 20) * (car.condition / 100),
            8,
            car.condition > 70 ? 0x27ae60 : car.condition > 40 ? 0xf39c12 : 0xe74c3c
        );

        // Texto da condição
        this.add.text(x, y + 25, `Condição: ${car.condition}%`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        // Estatísticas básicas
        this.add.text(x, y + 40, `Vel. Base: ${car.baseTopSpeed}km/h`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        this.add.text(x, y + 55, `Acel. Base: ${car.baseAcceleration}`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        this.add.text(x, y + 70, `Manuseio Base: ${car.baseHandling}`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        // Preço
        this.add.text(x, y + 90, `Preço: R$ ${car.buy_price.toLocaleString('pt-BR')}`, {
            fontSize: '12px',
            color: '#f39c12',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Preço base (para referência)
        this.add.text(x, y + 105, `Valor Base: R$ ${car.price_base.toLocaleString('pt-BR')}`, {
            fontSize: '10px',
            color: '#95a5a6'
        }).setOrigin(0.5);

        // Botão de compra
        const buyBtn = this.add.rectangle(x, y + 130, width - 20, 30, 0x27ae60)
            .setStrokeStyle(2, 0x2ecc71)
            .setInteractive()
            .on('pointerdown', () => this.onBuyCar(car.id))
            .on('pointerover', () => {
                if (this.carManager.budget >= car.buy_price) {
                    buyBtn.setTint(0x2ecc71);
                } else {
                    buyBtn.setTint(0xe74c3c);
                }
            })
            .on('pointerout', () => buyBtn.clearTint());
        
        const buyText = this.add.text(x, y + 130, 'Comprar', {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Desabilita botão se não tiver orçamento suficiente
        if (this.carManager.budget < car.buy_price) {
            buyBtn.setTint(0x7f8c8d);
            buyText.setColor('#bdc3c7');
        }

        // Armazena referência do card
        this.carCards.push({
            cardBg,
            carImage,
            conditionBar,
            conditionFill,
            buyBtn,
            buyText
        });
    }

    /**
     * Mostra mensagem quando não há carros disponíveis
     */
    showEmptyJunkyard() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Nenhum Carro Disponível\n\nVolte mais tarde!', {
            fontSize: '18px',
            color: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

    /**
     * Callback para comprar carro
     * @param {string} carId - ID do carro
     */
    onBuyCar(carId) {
        const car = this.carManager.getAvailableCar(carId);
        if (!car) return;

        if (this.carManager.budget < car.buy_price) {
            this.uiManager.showNotification('Orçamento insuficiente!', 'error');
            return;
        }

        if (this.carManager.buyCar(carId)) {
            this.uiManager.showNotification(`${car.name} comprado com sucesso!`, 'success');
            this.updateCarDisplay();
            this.uiManager.updateBudget(this.carManager.budget);
        } else {
            this.uiManager.showNotification('Erro ao comprar carro!', 'error');
        }
    }
}








