/**
 * UIManager - Gerencia a interface do usuário
 * Responsável por atualizar displays, modais e interações
 */
export class UIManager {
    constructor() {
        this.currentScene = 'workshop';
        this.modals = {};
        this.init();
    }

    /**
     * Inicializa a UI
     */
    init() {
        this.setupEventListeners();
        this.setupModals();
    }

    /**
     * Configura os event listeners da UI
     */
    setupEventListeners() {
        // Navegação entre cenas
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const scene = e.target.dataset.scene;
                this.switchScene(scene);
            });
        });

        // Botões de salvar/reset
        document.getElementById('save-btn').addEventListener('click', () => {
            this.onSaveRequested();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.onResetRequested();
        });

        // Fechar modais ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    /**
     * Configura os modais
     */
    setupModals() {
        this.modals = {
            modify: document.getElementById('modify-modal'),
            restore: document.getElementById('restore-modal'),
            sell: document.getElementById('sell-modal')
        };
    }

    /**
     * Muda a cena atual
     * @param {string} sceneName - Nome da cena
     */
    switchScene(sceneName) {
        // Remove classe active de todos os itens de navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona classe active ao item selecionado
        document.querySelector(`[data-scene="${sceneName}"]`).classList.add('active');

        this.currentScene = sceneName;
        
        // Dispara evento customizado para as cenas
        window.dispatchEvent(new CustomEvent('sceneChanged', { 
            detail: { scene: sceneName } 
        }));
    }

    /**
     * Atualiza o display do orçamento
     * @param {number} budget - Valor do orçamento
     */
    updateBudget(budget) {
        const budgetElement = document.getElementById('budget-amount');
        if (budgetElement) {
            budgetElement.textContent = budget.toLocaleString('pt-BR');
        }
    }

    /**
     * Mostra um modal
     * @param {string} modalId - ID do modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Fecha um modal
     * @param {string} modalId - ID do modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Fecha todos os modais
     */
    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
        document.body.style.overflow = 'auto';
    }

    /**
     * Mostra modal de modificação de carro
     * @param {Object} car - Dados do carro
     * @param {Function} onModify - Callback para modificação
     */
    showModifyModal(car, onModify) {
        const content = document.getElementById('modify-content');
        const stats = this.calculateCarStats(car);
        
        content.innerHTML = `
            <div class="car-info">
                <h4>${car.name}</h4>
                <div class="stats-display">
                    <div class="stat-item">
                        <div class="stat-label">Velocidade Máxima</div>
                        <div class="stat-value">${stats.topSpeed} km/h</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Aceleração</div>
                        <div class="stat-value">${stats.acceleration}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Manuseio</div>
                        <div class="stat-value">${stats.handling}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Condição</div>
                        <div class="stat-value">${car.condition}%</div>
                    </div>
                </div>
            </div>
            
            <div class="modify-options">
                <div class="form-group">
                    <label>Motor (Nível ${car.engineLevel}/5)</label>
                    <select id="engine-level">
                        ${this.generateLevelOptions(car.engineLevel, 5)}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Pneus (Nível ${car.tiresLevel}/5)</label>
                    <select id="tires-level">
                        ${this.generateLevelOptions(car.tiresLevel, 5)}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Suspensão (Nível ${car.suspensionLevel}/5)</label>
                    <select id="suspension-level">
                        ${this.generateLevelOptions(car.suspensionLevel, 5)}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Cor</label>
                    <select id="paint-color">
                        <option value="#FF0000" ${car.paint === '#FF0000' ? 'selected' : ''}>Vermelho</option>
                        <option value="#00FF00" ${car.paint === '#00FF00' ? 'selected' : ''}>Verde</option>
                        <option value="#0000FF" ${car.paint === '#0000FF' ? 'selected' : ''}>Azul</option>
                        <option value="#FFFF00" ${car.paint === '#FFFF00' ? 'selected' : ''}>Amarelo</option>
                        <option value="#FF00FF" ${car.paint === '#FF00FF' ? 'selected' : ''}>Magenta</option>
                        <option value="#00FFFF" ${car.paint === '#00FFFF' ? 'selected' : ''}>Ciano</option>
                    </select>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="uiManager.applyModifications('${car.id}')">
                    Aplicar Modificações
                </button>
                <button class="btn btn-warning" onclick="uiManager.closeModal('modify-modal')">
                    Cancelar
                </button>
            </div>
        `;

        this.showModal('modify-modal');
        this.currentModifyCallback = onModify;
    }

    /**
     * Mostra modal de restauração de carro
     * @param {Object} car - Dados do carro
     * @param {Function} onRestore - Callback para restauração
     */
    showRestoreModal(car, onRestore) {
        const content = document.getElementById('restore-content');
        const restorationCost = this.calculateRestorationCost(car);
        
        content.innerHTML = `
            <div class="car-info">
                <h4>${car.name}</h4>
                <div class="condition-info">
                    <div class="condition-bar">
                        <div class="condition-fill" style="width: ${car.condition}%"></div>
                    </div>
                    <p>Condição atual: ${car.condition}%</p>
                    <p>Custo de restauração: R$ ${restorationCost.toLocaleString('pt-BR')}</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-success" onclick="uiManager.applyRestoration('${car.id}')">
                    Restaurar (R$ ${restorationCost.toLocaleString('pt-BR')})
                </button>
                <button class="btn btn-warning" onclick="uiManager.closeModal('restore-modal')">
                    Cancelar
                </button>
            </div>
        `;

        this.showModal('restore-modal');
        this.currentRestoreCallback = onRestore;
    }

    /**
     * Mostra modal de venda de carro
     * @param {Object} car - Dados do carro
     * @param {Function} onSell - Callback para venda
     */
    showSellModal(car, onSell) {
        const content = document.getElementById('sell-content');
        const sellPrice = this.calculateSellPrice(car);
        
        content.innerHTML = `
            <div class="car-info">
                <h4>${car.name}</h4>
                <div class="sell-info">
                    <p>Condição: ${car.condition}%</p>
                    <p>Preço de compra: R$ ${car.buy_price.toLocaleString('pt-BR')}</p>
                    <p>Preço de venda: R$ ${sellPrice.toLocaleString('pt-BR')}</p>
                    <p>Lucro/Prejuízo: R$ ${(sellPrice - car.buy_price).toLocaleString('pt-BR')}</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-danger" onclick="uiManager.applySell('${car.id}')">
                    Vender (R$ ${sellPrice.toLocaleString('pt-BR')})
                </button>
                <button class="btn btn-warning" onclick="uiManager.closeModal('sell-modal')">
                    Cancelar
                </button>
            </div>
        `;

        this.showModal('sell-modal');
        this.currentSellCallback = onSell;
    }

    /**
     * Aplica modificações no carro
     * @param {string} carId - ID do carro
     */
    applyModifications(carId) {
        const engineLevel = parseInt(document.getElementById('engine-level').value);
        const tiresLevel = parseInt(document.getElementById('tires-level').value);
        const suspensionLevel = parseInt(document.getElementById('suspension-level').value);
        const paintColor = document.getElementById('paint-color').value;

        if (this.currentModifyCallback) {
            this.currentModifyCallback(carId, {
                engineLevel,
                tiresLevel,
                suspensionLevel,
                paint: paintColor
            });
        }

        this.closeModal('modify-modal');
        this.currentModifyCallback = null;
    }

    /**
     * Aplica restauração no carro
     * @param {string} carId - ID do carro
     */
    applyRestoration(carId) {
        if (this.currentRestoreCallback) {
            this.currentRestoreCallback(carId);
        }

        this.closeModal('restore-modal');
        this.currentRestoreCallback = null;
    }

    /**
     * Aplica venda do carro
     * @param {string} carId - ID do carro
     */
    applySell(carId) {
        if (this.currentSellCallback) {
            this.currentSellCallback(carId);
        }

        this.closeModal('sell-modal');
        this.currentSellCallback = null;
    }

    /**
     * Gera opções de nível para selects
     * @param {number} currentLevel - Nível atual
     * @param {number} maxLevel - Nível máximo
     * @returns {string} HTML das opções
     */
    generateLevelOptions(currentLevel, maxLevel) {
        let options = '';
        for (let i = 1; i <= maxLevel; i++) {
            const selected = i === currentLevel ? 'selected' : '';
            options += `<option value="${i}" ${selected}>Nível ${i}</option>`;
        }
        return options;
    }

    /**
     * Calcula estatísticas do carro
     * @param {Object} car - Dados do carro
     * @returns {Object} Estatísticas calculadas
     */
    calculateCarStats(car) {
        const topSpeed = Math.round(
            car.baseTopSpeed * 
            (1 + 0.08 * (car.engineLevel - 1)) * 
            (car.condition / 100)
        );
        
        const acceleration = Math.round(
            car.baseAcceleration * 
            (1 + 0.12 * (car.engineLevel - 1)) * 
            (car.condition / 100)
        );
        
        const handling = Math.round(
            car.baseHandling * 
            (1 + 0.06 * (car.tiresLevel - 1)) * 
            (car.condition / 100)
        );

        return { topSpeed, acceleration, handling };
    }

    /**
     * Calcula custo de restauração
     * @param {Object} car - Dados do carro
     * @returns {number} Custo de restauração
     */
    calculateRestorationCost(car) {
        return Math.round(
            ((100 - car.condition) * car.price_base / 100) * 0.8
        );
    }

    /**
     * Calcula preço de venda
     * @param {Object} car - Dados do carro
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
     * Mostra notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, warning)
     */
    showNotification(message, type = 'info') {
        // Implementação simples de notificação
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

    /**
     * Callback para solicitação de salvamento
     */
    onSaveRequested() {
        window.dispatchEvent(new CustomEvent('saveRequested'));
    }

    /**
     * Callback para solicitação de reset
     */
    onResetRequested() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos.')) {
            window.dispatchEvent(new CustomEvent('resetRequested'));
        }
    }
}

// Função global para fechar modais (chamada pelo HTML)
window.closeModal = function(modalId) {
    if (window.uiManager) {
        window.uiManager.closeModal(modalId);
    }
};
