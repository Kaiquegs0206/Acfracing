/**
 * SaveManager - Gerencia o salvamento e carregamento do jogo
 * Usa localStorage para persistência local
 */
export class SaveManager {
    constructor() {
        this.saveKey = 'automotive_workshop_save';
    }

    /**
     * Salva o estado atual do jogo
     * @param {Object} gameState - Estado do jogo a ser salvo
     */
    save(gameState) {
        try {
            const saveData = {
                budget: gameState.budget,
                garage: gameState.garage,
                transactionHistory: gameState.transactionHistory,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Jogo salvo com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao salvar o jogo:', error);
            return false;
        }
    }

    /**
     * Carrega o estado salvo do jogo
     * @returns {Object|null} Estado do jogo ou null se não houver save
     */
    load() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) {
                console.log('Nenhum save encontrado');
                return null;
            }

            const gameState = JSON.parse(saveData);
            console.log('Jogo carregado com sucesso!');
            return gameState;
        } catch (error) {
            console.error('Erro ao carregar o jogo:', error);
            return null;
        }
    }

    /**
     * Verifica se existe um save válido
     * @returns {boolean} True se existe save
     */
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    /**
     * Remove o save atual
     */
    clear() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('Save removido com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao remover save:', error);
            return false;
        }
    }

    /**
     * Exporta o save como JSON para backup
     * @returns {string} JSON do save
     */
    exportSave() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) {
                throw new Error('Nenhum save encontrado');
            }
            return saveData;
        } catch (error) {
            console.error('Erro ao exportar save:', error);
            return null;
        }
    }

    /**
     * Importa um save de um JSON
     * @param {string} saveJson - JSON do save
     * @returns {boolean} Sucesso da importação
     */
    importSave(saveJson) {
        try {
            const saveData = JSON.parse(saveJson);
            
            // Validação básica da estrutura
            if (!saveData.budget || !Array.isArray(saveData.garage)) {
                throw new Error('Formato de save inválido');
            }

            localStorage.setItem(this.saveKey, saveJson);
            console.log('Save importado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao importar save:', error);
            return false;
        }
    }

    /**
     * Obtém informações do save (data, tamanho, etc.)
     * @returns {Object|null} Informações do save
     */
    getSaveInfo() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) return null;

            const parsed = JSON.parse(saveData);
            return {
                timestamp: parsed.timestamp,
                budget: parsed.budget,
                garageSize: parsed.garage.length,
                dataSize: saveData.length
            };
        } catch (error) {
            console.error('Erro ao obter informações do save:', error);
            return null;
        }
    }

    /**
     * Cria um backup automático
     * @param {Object} gameState - Estado atual do jogo
     */
    createBackup(gameState) {
        try {
            const backupKey = this.saveKey + '_backup';
            const backupData = {
                ...gameState,
                timestamp: new Date().toISOString(),
                isBackup: true
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            console.log('Backup criado automaticamente');
        } catch (error) {
            console.error('Erro ao criar backup:', error);
        }
    }

    /**
     * Restaura do backup se o save principal estiver corrompido
     * @returns {boolean} Sucesso da restauração
     */
    restoreFromBackup() {
        try {
            const backupKey = this.saveKey + '_backup';
            const backupData = localStorage.getItem(backupKey);
            
            if (!backupData) {
                console.log('Nenhum backup encontrado');
                return false;
            }

            localStorage.setItem(this.saveKey, backupData);
            console.log('Restaurado do backup com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao restaurar do backup:', error);
            return false;
        }
    }
}








