/**
 * main.js - Ponto de entrada do jogo
 * Configura o Phaser e gerencia as cenas
 */
import { CarManager } from './game/carManager.js';
import { SaveManager } from './utils/saveManager.js';
import { UIManager } from './ui/UIManager.js';
import { WorkshopScene } from './scenes/WorkshopScene.js';
import { JunkyardScene } from './scenes/JunkyardScene.js';
import { TestTrackScene } from './scenes/TestTrackScene.js';

class AutomotiveWorkshopGame {
    constructor() {
        this.carManager = null;
        this.saveManager = null;
        this.uiManager = null;
        this.game = null;
    }

    /**
     * Inicializa o jogo
     */
    async init() {
        try {
            // Inicializa managers
            this.carManager = new CarManager();
            this.saveManager = new SaveManager();
            this.uiManager = new UIManager();

            // Carrega dados salvos
            await this.loadGameData();

            // Configura o Phaser
            this.setupPhaser();

            // Configura event listeners
            this.setupEventListeners();

            console.log('Jogo inicializado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar o jogo:', error);
        }
    }

    /**
     * Carrega dados salvos do jogo
     */
    async loadGameData() {
        const savedData = this.saveManager.load();
        
        if (savedData) {
            // Restaura estado do jogo
            this.carManager.budget = savedData.budget;
            this.carManager.garage = savedData.garage;
            this.carManager.transactionHistory = savedData.transactionHistory;
            
            console.log('Dados do jogo carregados');
        } else {
            // Estado inicial
            await this.carManager.loadSampleCars();
            console.log('Novo jogo iniciado');
        }

        // Atualiza UI
        this.uiManager.updateBudget(this.carManager.budget);
    }

    /**
     * Configura o Phaser
     */
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

        // Aguarda um frame antes de iniciar a cena
        this.game.events.once('ready', () => {
            this.game.scene.start('WorkshopScene', {
                carManager: this.carManager,
                uiManager: this.uiManager
            });
        });
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Mudança de cena
        window.addEventListener('sceneChanged', (event) => {
            const scene = event.detail.scene;
            this.switchScene(scene);
        });

        // Salvamento
        window.addEventListener('saveRequested', () => {
            this.saveGame();
        });

        // Reset
        window.addEventListener('resetRequested', () => {
            this.resetGame();
        });

        // Redimensionamento da janela
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Salva automaticamente a cada 30 segundos
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    /**
     * Muda a cena atual
     * @param {string} sceneName - Nome da cena
     */
    switchScene(sceneName) {
        if (!this.game) return;

        const sceneKey = this.getSceneKey(sceneName);
        this.game.scene.start(sceneKey, {
            carManager: this.carManager,
            uiManager: this.uiManager
        });
    }

    /**
     * Converte nome da cena para chave do Phaser
     * @param {string} sceneName - Nome da cena
     * @returns {string} Chave da cena
     */
    getSceneKey(sceneName) {
        const sceneMap = {
            'workshop': 'WorkshopScene',
            'junkyard': 'JunkyardScene',
            'testtrack': 'TestTrackScene'
        };
        return sceneMap[sceneName] || 'WorkshopScene';
    }

    /**
     * Salva o jogo
     */
    saveGame() {
        const gameState = {
            budget: this.carManager.budget,
            garage: this.carManager.garage,
            transactionHistory: this.carManager.transactionHistory
        };

        if (this.saveManager.save(gameState)) {
            this.uiManager.showNotification('Jogo salvo com sucesso!', 'success');
        } else {
            this.uiManager.showNotification('Erro ao salvar o jogo!', 'error');
        }
    }

    /**
     * Salva automaticamente
     */
    autoSave() {
        const gameState = {
            budget: this.carManager.budget,
            garage: this.carManager.garage,
            transactionHistory: this.carManager.transactionHistory
        };

        this.saveManager.save(gameState);
        console.log('Auto-save realizado');
    }

    /**
     * Reseta o jogo
     */
    resetGame() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos.')) {
            this.carManager.reset();
            this.saveManager.clear();
            this.uiManager.updateBudget(this.carManager.budget);
            
            // Reinicia a cena atual
            this.switchScene(this.uiManager.currentScene);
            
            this.uiManager.showNotification('Jogo resetado!', 'success');
        }
    }

    /**
     * Lida com redimensionamento da janela
     */
    handleResize() {
        if (this.game) {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * Exporta save para backup
     */
    exportSave() {
        const saveData = this.saveManager.exportSave();
        if (saveData) {
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'automotive_workshop_save.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Importa save de backup
     * @param {File} file - Arquivo de save
     */
    async importSave(file) {
        try {
            const text = await file.text();
            if (this.saveManager.importSave(text)) {
                // Recarrega o jogo com os dados importados
                location.reload();
            } else {
                this.uiManager.showNotification('Erro ao importar save!', 'error');
            }
        } catch (error) {
            this.uiManager.showNotification('Erro ao ler arquivo!', 'error');
        }
    }
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    // Torna o jogo globalmente acessível
    window.gameInstance = new AutomotiveWorkshopGame();
    await window.gameInstance.init();
    
    // Torna o UIManager globalmente acessível para os modais
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
