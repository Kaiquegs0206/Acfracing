/**
 * Versão simplificada do main.js sem módulos ES6
 * Para garantir compatibilidade
 */

// CarManager simplificado
class CarManager {
    constructor() {
        this.garage = [];
        this.availableCars = [];
        this.budget = 10000;
        this.transactionHistory = [];
        this.loadSampleCars();
    }

    loadSampleCars() {
        this.availableCars = [
            {
                id: "car_01",
                name: "Fusca 1970",
                image: "car_01.png",
                price_base: 5000,
                buy_price: 2000,
                condition: 45,
                baseTopSpeed: 120,
                baseAcceleration: 8,
                baseHandling: 6,
                engineLevel: 1,
                tiresLevel: 1,
                suspensionLevel: 1,
                paint: "#FF0000"
            },
            {
                id: "car_02",
                name: "Kombi 1985",
                image: "car_02.png",
                price_base: 8000,
                buy_price: 3500,
                condition: 60,
                baseTopSpeed: 100,
                baseAcceleration: 6,
                baseHandling: 5,
                engineLevel: 1,
                tiresLevel: 1,
                suspensionLevel: 1,
                paint: "#00FF00"
            },
            {
                id: "car_03",
                name: "Brasília 1980",
                image: "car_03.png",
                price_base: 4000,
                buy_price: 1500,
                condition: 30,
                baseTopSpeed: 110,
                baseAcceleration: 7,
                baseHandling: 7,
                engineLevel: 1,
                tiresLevel: 1,
                suspensionLevel: 1,
                paint: "#0000FF"
            }
        ];
    }

    calculateTopSpeed(car) {
        return Math.round(
            car.baseTopSpeed * 
            (1 + 0.08 * (car.engineLevel - 1)) * 
            (car.condition / 100)
        );
    }

    calculateAcceleration(car) {
        return Math.round(
            car.baseAcceleration * 
            (1 + 0.12 * (car.engineLevel - 1)) * 
            (car.condition / 100)
        );
    }

    calculateHandling(car) {
        return Math.round(
            car.baseHandling * 
            (1 + 0.06 * (car.tiresLevel - 1)) * 
            (car.condition / 100)
        );
    }

    calculateRestorationCost(car) {
        return Math.round(
            ((100 - car.condition) * car.price_base / 100) * 0.8
        );
    }

    calculateSellPrice(car) {
        const totalUpgrades = (car.engineLevel - 1) + (car.tiresLevel - 1) + (car.suspensionLevel - 1);
        return Math.round(
            car.buy_price * 
            (car.condition / 100) * 
            (1 + 0.05 * totalUpgrades)
        );
    }

    buyCar(carId) {
        const carIndex = this.availableCars.findIndex(car => car.id === carId);
        if (carIndex === -1) return false;

        const car = this.availableCars[carIndex];
        
        if (this.budget < car.buy_price) {
            return false;
        }

        const boughtCar = { ...car };
        this.availableCars.splice(carIndex, 1);
        this.garage.push(boughtCar);
        
        this.budget -= car.buy_price;
        
        this.addTransaction('compra', car.name, -car.buy_price);
        
        return true;
    }

    sellCar(carId) {
        const carIndex = this.garage.findIndex(car => car.id === carId);
        if (carIndex === -1) return false;

        const car = this.garage[carIndex];
        const sellPrice = this.calculateSellPrice(car);
        
        this.garage.splice(carIndex, 1);
        this.budget += sellPrice;
        
        this.addTransaction('venda', car.name, sellPrice);
        
        return true;
    }

    restoreCar(carId) {
        const car = this.garage.find(car => car.id === carId);
        if (!car) return false;

        const cost = this.calculateRestorationCost(car);
        
        if (this.budget < cost) {
            return false;
        }

        car.condition = 100;
        this.budget -= cost;
        
        this.addTransaction('restauração', car.name, -cost);
        
        return true;
    }

    addTransaction(type, carName, amount) {
        this.transactionHistory.push({
            type,
            carName,
            amount,
            timestamp: new Date().toLocaleString()
        });
    }

    getCarStats(car) {
        return {
            topSpeed: this.calculateTopSpeed(car),
            acceleration: this.calculateAcceleration(car),
            handling: this.calculateHandling(car),
            sellPrice: this.calculateSellPrice(car),
            restorationCost: this.calculateRestorationCost(car)
        };
    }

    getCarFromGarage(carId) {
        return this.garage.find(car => car.id === carId) || null;
    }

    getAvailableCar(carId) {
        return this.availableCars.find(car => car.id === carId) || null;
    }

    reset() {
        this.garage = [];
        this.budget = 10000;
        this.transactionHistory = [];
        this.loadSampleCars();
    }
}

// UIManager simplificado
class UIManager {
    constructor() {
        this.currentScene = 'workshop';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const scene = e.target.dataset.scene;
                this.switchScene(scene);
            });
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.onSaveRequested();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.onResetRequested();
        });
    }

    switchScene(sceneName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        document.querySelector(`[data-scene="${sceneName}"]`).classList.add('active');

        this.currentScene = sceneName;
        
        window.dispatchEvent(new CustomEvent('sceneChanged', { 
            detail: { scene: sceneName } 
        }));
    }

    updateBudget(budget) {
        const budgetElement = document.getElementById('budget-amount');
        if (budgetElement) {
            budgetElement.textContent = budget.toLocaleString('pt-BR');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    onSaveRequested() {
        window.dispatchEvent(new CustomEvent('saveRequested'));
    }

    onResetRequested() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos.')) {
            window.dispatchEvent(new CustomEvent('resetRequested'));
        }
    }
}

// WorkshopScene simplificada
class WorkshopScene extends Phaser.Scene {
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
        console.log('WorkshopScene: create() chamado');
        console.log('CarManager:', this.carManager);
        console.log('Garage:', this.carManager?.garage);
        
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

    createGarageArea() {
        const garageArea = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2 + 50, 
            this.scale.width - 250, 
            this.scale.height - 150, 
            0x34495e
        ).setStrokeStyle(2, 0xecf0f1);

        this.add.text(garageArea.x, garageArea.y - garageArea.height / 2 + 20, 'Seus Carros', {
            fontSize: '20px',
            color: '#ecf0f1'
        }).setOrigin(0.5);
    }

    updateCarDisplay() {
        this.carCards.forEach(card => card.destroy());
        this.carCards = [];

        const garage = this.carManager.garage;
        
        if (garage.length === 0) {
            this.showEmptyGarage();
            return;
        }

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

    createCarCard(car, x, y, width, height) {
        const cardBg = this.add.rectangle(x, y, width, height, 0x2c3e50)
            .setStrokeStyle(2, 0xecf0f1)
            .setInteractive()
            .on('pointerover', () => cardBg.setTint(0x34495e))
            .on('pointerout', () => cardBg.clearTint());

        const carImage = this.add.rectangle(x, y - 60, width - 20, 80, 0x7f8c8d)
            .setStrokeStyle(1, 0x95a5a6);
        
        this.add.text(x, y - 60, car.image.replace('.png', ''), {
            fontSize: '12px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        this.add.text(x, y - 20, car.name, {
            fontSize: '14px',
            color: '#ecf0f1',
            wordWrap: { width: width - 20 }
        }).setOrigin(0.5);

        const conditionBar = this.add.rectangle(x, y + 10, width - 20, 8, 0x34495e)
            .setStrokeStyle(1, 0x95a5a6);
        
        const conditionFill = this.add.rectangle(
            x - (width - 20) / 2 + (width - 20) * (car.condition / 100) / 2,
            y + 10,
            (width - 20) * (car.condition / 100),
            8,
            car.condition > 70 ? 0x27ae60 : car.condition > 40 ? 0xf39c12 : 0xe74c3c
        );

        this.add.text(x, y + 25, `${car.condition}%`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        const stats = this.carManager.getCarStats(car);
        this.add.text(x, y + 40, `Vel: ${stats.topSpeed}km/h`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        const buttonY = y + 70;
        const buttonWidth = (width - 30) / 3;
        
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

    showEmptyGarage() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Garagem Vazia\n\nVá ao Ferro-velho para comprar carros!', {
            fontSize: '18px',
            color: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

    onRestoreCar(carId) {
        const car = this.carManager.getCarFromGarage(carId);
        if (!car) return;

        if (this.carManager.restoreCar(carId)) {
            this.uiManager.showNotification('Carro restaurado com sucesso!', 'success');
            this.updateCarDisplay();
            this.uiManager.updateBudget(this.carManager.budget);
        } else {
            this.uiManager.showNotification('Orçamento insuficiente!', 'error');
        }
    }

    onModifyCar(carId) {
        this.uiManager.showNotification('Funcionalidade de modificação em desenvolvimento!', 'info');
    }

    onSellCar(carId) {
        const car = this.carManager.getCarFromGarage(carId);
        if (!car) return;

        if (this.carManager.sellCar(carId)) {
            this.uiManager.showNotification('Carro vendido com sucesso!', 'success');
            this.updateCarDisplay();
            this.uiManager.updateBudget(this.carManager.budget);
        } else {
            this.uiManager.showNotification('Erro ao vender carro!', 'error');
        }
    }

    onTestCar(carId) {
        this.uiManager.showNotification('Funcionalidade de teste em desenvolvimento!', 'info');
    }
}

// JunkyardScene simplificada
class JunkyardScene extends Phaser.Scene {
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
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x2c3e50);
        this.add.text(this.scale.width / 2, 50, 'Ferro-velho', {
            fontSize: '32px',
            color: '#ecf0f1'
        }).setOrigin(0.5);

        this.createJunkyardArea();
        this.updateCarDisplay();
    }

    createJunkyardArea() {
        const junkyardArea = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2 + 50, 
            this.scale.width - 250, 
            this.scale.height - 150, 
            0x34495e
        ).setStrokeStyle(2, 0xecf0f1);

        this.add.text(junkyardArea.x, junkyardArea.y - junkyardArea.height / 2 + 20, 'Carros Disponíveis', {
            fontSize: '20px',
            color: '#ecf0f1'
        }).setOrigin(0.5);
    }

    updateCarDisplay() {
        this.carCards.forEach(card => card.destroy());
        this.carCards = [];

        const availableCars = this.carManager.availableCars;
        
        if (availableCars.length === 0) {
            this.showEmptyJunkyard();
            return;
        }

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

    createCarCard(car, x, y, width, height) {
        const cardBg = this.add.rectangle(x, y, width, height, 0x2c3e50)
            .setStrokeStyle(2, 0xecf0f1)
            .setInteractive()
            .on('pointerover', () => cardBg.setTint(0x34495e))
            .on('pointerout', () => cardBg.clearTint());

        const carImage = this.add.rectangle(x, y - 70, width - 20, 90, 0x7f8c8d)
            .setStrokeStyle(1, 0x95a5a6);
        
        this.add.text(x, y - 70, car.image.replace('.png', ''), {
            fontSize: '12px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

        this.add.text(x, y - 20, car.name, {
            fontSize: '14px',
            color: '#ecf0f1',
            wordWrap: { width: width - 20 }
        }).setOrigin(0.5);

        const conditionBar = this.add.rectangle(x, y + 10, width - 20, 8, 0x34495e)
            .setStrokeStyle(1, 0x95a5a6);
        
        const conditionFill = this.add.rectangle(
            x - (width - 20) / 2 + (width - 20) * (car.condition / 100) / 2,
            y + 10,
            (width - 20) * (car.condition / 100),
            8,
            car.condition > 70 ? 0x27ae60 : car.condition > 40 ? 0xf39c12 : 0xe74c3c
        );

        this.add.text(x, y + 25, `Condição: ${car.condition}%`, {
            fontSize: '10px',
            color: '#bdc3c7'
        }).setOrigin(0.5);

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

        this.add.text(x, y + 90, `Preço: R$ ${car.buy_price.toLocaleString('pt-BR')}`, {
            fontSize: '12px',
            color: '#f39c12',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(x, y + 105, `Valor Base: R$ ${car.price_base.toLocaleString('pt-BR')}`, {
            fontSize: '10px',
            color: '#95a5a6'
        }).setOrigin(0.5);

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

        if (this.carManager.budget < car.buy_price) {
            buyBtn.setTint(0x7f8c8d);
            buyText.setColor('#bdc3c7');
        }

        this.carCards.push({
            cardBg,
            carImage,
            conditionBar,
            conditionFill,
            buyBtn,
            buyText
        });
    }

    showEmptyJunkyard() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Nenhum Carro Disponível\n\nVolte mais tarde!', {
            fontSize: '18px',
            color: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

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

// TestTrackScene simplificada
class TestTrackScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestTrackScene' });
        this.carManager = null;
        this.uiManager = null;
        this.selectedCar = null;
        this.car = null;
        this.cursors = null;
    }

    init(data) {
        this.carManager = data.carManager;
        this.uiManager = data.uiManager;
        this.selectedCar = data.selectedCar;
    }

    create() {
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x27ae60);
        
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Pista de Teste\n\nFuncionalidade em desenvolvimento!', {
            fontSize: '24px',
            color: '#ecf0f1',
            align: 'center'
        }).setOrigin(0.5);

        const backBtn = this.add.rectangle(100, this.scale.height - 50, 100, 40, 0x34495e)
            .setStrokeStyle(2, 0xecf0f1)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('WorkshopScene', {
                carManager: this.carManager,
                uiManager: this.uiManager
            }))
            .on('pointerover', () => backBtn.setTint(0x2c3e50))
            .on('pointerout', () => backBtn.clearTint());
        
        this.add.text(100, this.scale.height - 50, 'Voltar', {
            fontSize: '16px',
            color: '#ecf0f1'
        }).setOrigin(0.5);
    }
}

// Classe principal do jogo
class AutomotiveWorkshopGame {
    constructor() {
        this.carManager = null;
        this.uiManager = null;
        this.game = null;
    }

    async init() {
        try {
            this.carManager = new CarManager();
            this.uiManager = new UIManager();

            this.setupPhaser();
            this.setupEventListeners();

            console.log('Jogo inicializado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar o jogo:', error);
        }
    }

    setupPhaser() {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'game-canvas',
            backgroundColor: '#2c3e50',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [
                WorkshopScene,
                JunkyardScene,
                TestTrackScene
            ]
        };

        this.game = new Phaser.Game(config);

        this.game.scene.start('WorkshopScene', {
            carManager: this.carManager,
            uiManager: this.uiManager
        });
    }

    setupEventListeners() {
        window.addEventListener('sceneChanged', (event) => {
            const scene = event.detail.scene;
            this.switchScene(scene);
        });

        window.addEventListener('saveRequested', () => {
            this.saveGame();
        });

        window.addEventListener('resetRequested', () => {
            this.resetGame();
        });
    }

    switchScene(sceneName) {
        if (!this.game) return;

        const sceneKey = this.getSceneKey(sceneName);
        this.game.scene.start(sceneKey, {
            carManager: this.carManager,
            uiManager: this.uiManager
        });
    }

    getSceneKey(sceneName) {
        const sceneMap = {
            'workshop': 'WorkshopScene',
            'junkyard': 'JunkyardScene',
            'testtrack': 'TestTrackScene'
        };
        return sceneMap[sceneName] || 'WorkshopScene';
    }

    saveGame() {
        this.uiManager.showNotification('Jogo salvo com sucesso!', 'success');
    }

    resetGame() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos.')) {
            this.carManager.reset();
            this.uiManager.updateBudget(this.carManager.budget);
            this.switchScene(this.uiManager.currentScene);
            this.uiManager.showNotification('Jogo resetado!', 'success');
        }
    }
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    window.gameInstance = new AutomotiveWorkshopGame();
    await window.gameInstance.init();
    window.uiManager = window.gameInstance.uiManager;
});

// Adiciona estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);
