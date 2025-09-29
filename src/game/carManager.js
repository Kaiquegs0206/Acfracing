/**
 * CarManager - Gerencia todos os carros do jogo
 * Responsável por cálculos de performance, upgrades e transações
 */
export class CarManager {
    constructor() {
        this.garage = []; // Carros na garagem
        this.availableCars = []; // Carros disponíveis no ferro-velho
        this.budget = 10000; // Orçamento inicial
        this.transactionHistory = [];
        
        this.loadSampleCars();
    }

    /**
     * Carrega os carros de exemplo do arquivo JSON
     */
    async loadSampleCars() {
        try {
            const response = await fetch('./sample_cars.json');
            if (response.ok) {
                this.availableCars = await response.json();
            } else {
                throw new Error('Arquivo não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar carros:', error);
            // Fallback com dados básicos
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
    }

    /**
     * Calcula a velocidade máxima atual do carro
     * @param {Object} car - Objeto do carro
     * @returns {number} Velocidade máxima
     */
    calculateTopSpeed(car) {
        return Math.round(
            car.baseTopSpeed * 
            (1 + 0.08 * (car.engineLevel - 1)) * 
            (car.condition / 100)
        );
    }

    /**
     * Calcula a aceleração atual do carro
     * @param {Object} car - Objeto do carro
     * @returns {number} Aceleração
     */
    calculateAcceleration(car) {
        return Math.round(
            car.baseAcceleration * 
            (1 + 0.12 * (car.engineLevel - 1)) * 
            (car.condition / 100)
        );
    }

    /**
     * Calcula o manuseio atual do carro
     * @param {Object} car - Objeto do carro
     * @returns {number} Manuseio
     */
    calculateHandling(car) {
        return Math.round(
            car.baseHandling * 
            (1 + 0.06 * (car.tiresLevel - 1)) * 
            (car.condition / 100)
        );
    }

    /**
     * Calcula o custo de restauração
     * @param {Object} car - Objeto do carro
     * @returns {number} Custo de restauração
     */
    calculateRestorationCost(car) {
        return Math.round(
            ((100 - car.condition) * car.price_base / 100) * 0.8
        );
    }

    /**
     * Calcula o custo de upgrade do motor
     * @param {Object} car - Objeto do carro
     * @param {number} newLevel - Novo nível do motor
     * @returns {number} Custo do upgrade
     */
    calculateEngineUpgradeCost(car, newLevel) {
        const levelIncrement = newLevel - car.engineLevel;
        return Math.round(car.price_base * 0.1 * levelIncrement);
    }

    /**
     * Calcula o custo de upgrade dos pneus
     * @param {Object} car - Objeto do carro
     * @param {number} newLevel - Novo nível dos pneus
     * @returns {number} Custo do upgrade
     */
    calculateTiresUpgradeCost(car, newLevel) {
        const levelIncrement = newLevel - car.tiresLevel;
        return Math.round(car.price_base * 0.08 * levelIncrement);
    }

    /**
     * Calcula o custo de upgrade da suspensão
     * @param {Object} car - Objeto do carro
     * @param {number} newLevel - Novo nível da suspensão
     * @returns {number} Custo do upgrade
     */
    calculateSuspensionUpgradeCost(car, newLevel) {
        const levelIncrement = newLevel - car.suspensionLevel;
        return Math.round(car.price_base * 0.06 * levelIncrement);
    }

    /**
     * Calcula o preço de venda do carro
     * @param {Object} car - Objeto do carro
     * @returns {number} Preço de venda
     */
    calculateSellPrice(car) {
        const totalUpgrades = (car.engineLevel - 1) + (car.tiresLevel - 1) + (car.suspensionLevel - 1);
        return Math.round(
            car.buy_price * 
            (car.condition / 100) * 
            (1 + 0.05 * totalUpgrades)
        );
    }

    /**
     * Compra um carro do ferro-velho
     * @param {string} carId - ID do carro
     * @returns {boolean} Sucesso da compra
     */
    buyCar(carId) {
        const carIndex = this.availableCars.findIndex(car => car.id === carId);
        if (carIndex === -1) return false;

        const car = this.availableCars[carIndex];
        
        if (this.budget < car.buy_price) {
            return false; // Orçamento insuficiente
        }

        // Remove do ferro-velho e adiciona à garagem
        const boughtCar = { ...car };
        this.availableCars.splice(carIndex, 1);
        this.garage.push(boughtCar);
        
        // Atualiza orçamento
        this.budget -= car.buy_price;
        
        // Registra transação
        this.addTransaction('compra', car.name, -car.buy_price);
        
        return true;
    }

    /**
     * Vende um carro da garagem
     * @param {string} carId - ID do carro
     * @returns {boolean} Sucesso da venda
     */
    sellCar(carId) {
        const carIndex = this.garage.findIndex(car => car.id === carId);
        if (carIndex === -1) return false;

        const car = this.garage[carIndex];
        const sellPrice = this.calculateSellPrice(car);
        
        // Remove da garagem
        this.garage.splice(carIndex, 1);
        
        // Atualiza orçamento
        this.budget += sellPrice;
        
        // Registra transação
        this.addTransaction('venda', car.name, sellPrice);
        
        return true;
    }

    /**
     * Restaura a condição de um carro
     * @param {string} carId - ID do carro
     * @returns {boolean} Sucesso da restauração
     */
    restoreCar(carId) {
        const car = this.garage.find(car => car.id === carId);
        if (!car) return false;

        const cost = this.calculateRestorationCost(car);
        
        if (this.budget < cost) {
            return false; // Orçamento insuficiente
        }

        // Atualiza condição e orçamento
        car.condition = 100;
        this.budget -= cost;
        
        // Registra transação
        this.addTransaction('restauração', car.name, -cost);
        
        return true;
    }

    /**
     * Aplica upgrade no motor
     * @param {string} carId - ID do carro
     * @param {number} newLevel - Novo nível
     * @returns {boolean} Sucesso do upgrade
     */
    upgradeEngine(carId, newLevel) {
        const car = this.garage.find(car => car.id === carId);
        if (!car || newLevel <= car.engineLevel || newLevel > 5) return false;

        const cost = this.calculateEngineUpgradeCost(car, newLevel);
        
        if (this.budget < cost) {
            return false; // Orçamento insuficiente
        }

        // Aplica upgrade
        car.engineLevel = newLevel;
        this.budget -= cost;
        
        // Registra transação
        this.addTransaction('upgrade motor', car.name, -cost);
        
        return true;
    }

    /**
     * Aplica upgrade nos pneus
     * @param {string} carId - ID do carro
     * @param {number} newLevel - Novo nível
     * @returns {boolean} Sucesso do upgrade
     */
    upgradeTires(carId, newLevel) {
        const car = this.garage.find(car => car.id === carId);
        if (!car || newLevel <= car.tiresLevel || newLevel > 5) return false;

        const cost = this.calculateTiresUpgradeCost(car, newLevel);
        
        if (this.budget < cost) {
            return false; // Orçamento insuficiente
        }

        // Aplica upgrade
        car.tiresLevel = newLevel;
        this.budget -= cost;
        
        // Registra transação
        this.addTransaction('upgrade pneus', car.name, -cost);
        
        return true;
    }

    /**
     * Aplica upgrade na suspensão
     * @param {string} carId - ID do carro
     * @param {number} newLevel - Novo nível
     * @returns {boolean} Sucesso do upgrade
     */
    upgradeSuspension(carId, newLevel) {
        const car = this.garage.find(car => car.id === carId);
        if (!car || newLevel <= car.suspensionLevel || newLevel > 5) return false;

        const cost = this.calculateSuspensionUpgradeCost(car, newLevel);
        
        if (this.budget < cost) {
            return false; // Orçamento insuficiente
        }

        // Aplica upgrade
        car.suspensionLevel = newLevel;
        this.budget -= cost;
        
        // Registra transação
        this.addTransaction('upgrade suspensão', car.name, -cost);
        
        return true;
    }

    /**
     * Muda a cor do carro
     * @param {string} carId - ID do carro
     * @param {string} newColor - Nova cor
     * @returns {boolean} Sucesso da mudança
     */
    changePaint(carId, newColor) {
        const car = this.garage.find(car => car.id === carId);
        if (!car) return false;

        const cost = Math.round(car.price_base * 0.05); // 5% do preço base
        
        if (this.budget < cost) {
            return false; // Orçamento insuficiente
        }

        // Aplica mudança
        car.paint = newColor;
        this.budget -= cost;
        
        // Registra transação
        this.addTransaction('pintura', car.name, -cost);
        
        return true;
    }

    /**
     * Adiciona uma transação ao histórico
     * @param {string} type - Tipo da transação
     * @param {string} carName - Nome do carro
     * @param {number} amount - Valor (positivo para receita, negativo para despesa)
     */
    addTransaction(type, carName, amount) {
        this.transactionHistory.push({
            type,
            carName,
            amount,
            timestamp: new Date().toLocaleString()
        });
    }

    /**
     * Obtém estatísticas completas de um carro
     * @param {Object} car - Objeto do carro
     * @returns {Object} Estatísticas calculadas
     */
    getCarStats(car) {
        return {
            topSpeed: this.calculateTopSpeed(car),
            acceleration: this.calculateAcceleration(car),
            handling: this.calculateHandling(car),
            sellPrice: this.calculateSellPrice(car),
            restorationCost: this.calculateRestorationCost(car)
        };
    }

    /**
     * Obtém um carro da garagem por ID
     * @param {string} carId - ID do carro
     * @returns {Object|null} Carro encontrado ou null
     */
    getCarFromGarage(carId) {
        return this.garage.find(car => car.id === carId) || null;
    }

    /**
     * Obtém um carro disponível por ID
     * @param {string} carId - ID do carro
     * @returns {Object|null} Carro encontrado ou null
     */
    getAvailableCar(carId) {
        return this.availableCars.find(car => car.id === carId) || null;
    }

    /**
     * Reseta o jogo para o estado inicial
     */
    reset() {
        this.garage = [];
        this.budget = 10000;
        this.transactionHistory = [];
        this.loadSampleCars();
    }
}








