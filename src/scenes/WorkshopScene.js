/**
 * WorkshopScene - Cena da oficina/garagem
 * Mostra os carros comprados e permite modificações
 */
export class WorkshopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorkshopScene' });
        this.carManager = null;
        this.uiManager = null;
        this.carCards = [];
    }

    init(data) {
        this.carManager = data.carManager;
        this.uiManager = data.uiManager;
    }

    create() {
        // Fundo da oficina
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x2c3e50);
        this.add.text(this.scale.width / 2, 50, 'Oficina - Garagem', {
            fontSize: '32px',
            color: '#ecf0f1'
        }).setOrigin(0.5);

        // Área de carros
        this.createGarageArea();
        
        // Atualiza a exibição dos carros
        this.updateCarDisplay();
    }

    /**
     * Cria a área da garagem
     */
    createGarageArea() {
        const garageArea = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2 + 50, 
            this.scale.width - 250, 
            this.scale.height - 150, 
            0x34495e
        ).setStrokeStyle(2, 0xecf0f1);

        // Título da área
        this.add.text(garageArea.x, garageArea.y - garageArea.height / 2 + 20, 'Seus Carros', {
            fontSize: '20px',
            color: '#ecf0f1'
        }).setOrigin(0.5);
    }

    /**
     * Atualiza a exibição dos carros na garagem
     */
    updateCarDisplay() {
        // Remove cards antigos
        this.carCards.forEach(card => card.destroy());
        this.carCards = [];

        const garage = this.carManager.garage;
        
        if (garage.length === 0) {
            this.showEmptyGarage();
            return;
        }

        // Calcula layout da grid
        const cols = Math.min(3, garage.length);
        const rows = Math.ceil(garage.length / cols);
        const cardWidth = 200;
        const cardHeight = 250;
        const spacing = 20;
        
        const startX = 250 + (this.scale.width - 250 - (cols * cardWidth + (cols - 1) * spacing)) / 2;
        const startY = 150 + (this.scale.height - 150 - (rows * cardHeight + (rows - 1) * spacing)) / 2;

        garage.forEach((car, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            const x = startX + col * (cardWidth + spacing);
            const y = startY + row * (cardHeight + spacing);
            
            this.createCarCard(car, x, y, cardWidth, cardHeight);
        });
    }

    /**
     * Cria um card de carro
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
        const carImage = this.add.rectangle(x, y - 60, width - 20, 80, 0x7f8c8d)
            .setStrokeStyle(1, 0x95a5a6);
        
        // Texto placeholder da imagem
        this.add.text(x, y - 60, car.image.replace('.png', ''), {
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
        this.add.text(x, y + 25, `${car.condition}%`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        // Estatísticas básicas
        const stats = this.carManager.getCarStats(car);
        this.add.text(x, y + 40, `Vel: ${stats.topSpeed}km/h`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        // Botões de ação
        const buttonY = y + 70;
        const buttonWidth = (width - 30) / 3;
        
        // Botão Restaurar
        const restoreBtn = this.add.rectangle(x - buttonWidth, buttonY, buttonWidth - 5, 25, 0x27ae60)
            .setStrokeStyle(1, 0x2ecc71)
            .setInteractive()
            .on('pointerdown', () => this.onRestoreCar(car.id))
            .on('pointerover', () => restoreBtn.setTint(0x2ecc71))
            .on('pointerout', () => restoreBtn.clearTint());
        
        this.add.text(x - buttonWidth, buttonY, 'Restaurar', {
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botão Modificar
        const modifyBtn = this.add.rectangle(x, buttonY, buttonWidth - 5, 25, 0x3498db)
            .setStrokeStyle(1, 0x5dade2)
            .setInteractive()
            .on('pointerdown', () => this.onModifyCar(car.id))
            .on('pointerover', () => modifyBtn.setTint(0x5dade2))
            .on('pointerout', () => modifyBtn.clearTint());
        
        this.add.text(x, buttonY, 'Modificar', {
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botão Vender
        const sellBtn = this.add.rectangle(x + buttonWidth, buttonY, buttonWidth - 5, 25, 0xe74c3c)
            .setStrokeStyle(1, 0xec7063)
            .setInteractive()
            .on('pointerdown', () => this.onSellCar(car.id))
            .on('pointerover', () => sellBtn.setTint(0xec7063))
            .on('pointerout', () => sellBtn.clearTint());
        
        this.add.text(x + buttonWidth, buttonY, 'Vender', {
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botão Testar (pista)
        const testBtn = this.add.rectangle(x, buttonY + 35, width - 20, 20, 0xf39c12)
            .setStrokeStyle(1, 0xf7dc6f)
            .setInteractive()
            .on('pointerdown', () => this.onTestCar(car.id))
            .on('pointerover', () => testBtn.setTint(0xf7dc6f))
            .on('pointerout', () => testBtn.clearTint());
        
        this.add.text(x, buttonY + 35, 'Testar na Pista', {
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Armazena referência do card
        this.carCards.push({
            cardBg,
            carImage,
            conditionBar,
            conditionFill,
            restoreBtn,
            modifyBtn,
            sellBtn,
            testBtn
        });
    }

    /**
     * Mostra mensagem quando a garagem está vazia
     */
    showEmptyGarage() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Garagem Vazia\n\nVá ao Ferro-velho para comprar carros!', {
            fontSize: '18px',
            color: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

    /**
     * Callback para restaurar carro
     * @param {string} carId - ID do carro
     */
    onRestoreCar(carId) {
        const car = this.carManager.getCarFromGarage(carId);
        if (!car) return;

        this.uiManager.showRestoreModal(car, (id) => {
            if (this.carManager.restoreCar(id)) {
                this.uiManager.showNotification('Carro restaurado com sucesso!', 'success');
                this.updateCarDisplay();
                this.uiManager.updateBudget(this.carManager.budget);
            } else {
                this.uiManager.showNotification('Orçamento insuficiente!', 'error');
            }
        });
    }

    /**
     * Callback para modificar carro
     * @param {string} carId - ID do carro
     */
    onModifyCar(carId) {
        const car = this.carManager.getCarFromGarage(carId);
        if (!car) return;

        this.uiManager.showModifyModal(car, (id, modifications) => {
            let success = true;
            let totalCost = 0;

            // Calcula custos
            if (modifications.engineLevel > car.engineLevel) {
                totalCost += this.carManager.calculateEngineUpgradeCost(car, modifications.engineLevel);
            }
            if (modifications.tiresLevel > car.tiresLevel) {
                totalCost += this.carManager.calculateTiresUpgradeCost(car, modifications.tiresLevel);
            }
            if (modifications.suspensionLevel > car.suspensionLevel) {
                totalCost += this.carManager.calculateSuspensionUpgradeCost(car, modifications.suspensionLevel);
            }
            if (modifications.paint !== car.paint) {
                totalCost += Math.round(car.price_base * 0.05);
            }

            // Verifica se tem orçamento suficiente
            if (this.carManager.budget < totalCost) {
                this.uiManager.showNotification('Orçamento insuficiente!', 'error');
                return;
            }

            // Aplica modificações
            if (modifications.engineLevel > car.engineLevel) {
                success = this.carManager.upgradeEngine(id, modifications.engineLevel);
            }
            if (success && modifications.tiresLevel > car.tiresLevel) {
                success = this.carManager.upgradeTires(id, modifications.tiresLevel);
            }
            if (success && modifications.suspensionLevel > car.suspensionLevel) {
                success = this.carManager.upgradeSuspension(id, modifications.suspensionLevel);
            }
            if (success && modifications.paint !== car.paint) {
                success = this.carManager.changePaint(id, modifications.paint);
            }

            if (success) {
                this.uiManager.showNotification('Modificações aplicadas com sucesso!', 'success');
                this.updateCarDisplay();
                this.uiManager.updateBudget(this.carManager.budget);
            } else {
                this.uiManager.showNotification('Erro ao aplicar modificações!', 'error');
            }
        });
    }

    /**
     * Callback para vender carro
     * @param {string} carId - ID do carro
     */
    onSellCar(carId) {
        const car = this.carManager.getCarFromGarage(carId);
        if (!car) return;

        this.uiManager.showSellModal(car, (id) => {
            if (this.carManager.sellCar(id)) {
                this.uiManager.showNotification('Carro vendido com sucesso!', 'success');
                this.updateCarDisplay();
                this.uiManager.updateBudget(this.carManager.budget);
            } else {
                this.uiManager.showNotification('Erro ao vender carro!', 'error');
            }
        });
    }

    /**
     * Callback para testar carro na pista
     * @param {string} carId - ID do carro
     */
    onTestCar(carId) {
        const car = this.carManager.getCarFromGarage(carId);
        if (!car) return;

        // Muda para a cena da pista de teste
        this.scene.start('TestTrackScene', { 
            carManager: this.carManager,
            uiManager: this.uiManager,
            selectedCar: car
        });
    }
}








