/**
 * TestTrackScene - Cena da pista de teste
 * Permite dirigir carros com física realista
 */
export class TestTrackScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestTrackScene' });
        this.carManager = null;
        this.uiManager = null;
        this.selectedCar = null;
        this.car = null;
        this.cursors = null;
        this.wasd = null;
        this.speedometer = null;
        this.controls = null;
    }

    init(data) {
        this.carManager = data.carManager;
        this.uiManager = data.uiManager;
        this.selectedCar = data.selectedCar;
    }

    create() {
        // Fundo da pista
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x27ae60);
        
        // Cria a pista
        this.createTrack();
        
        // Cria o carro
        this.createCar();
        
        // Configura controles
        this.setupControls();
        
        // Cria UI da pista
        this.createTrackUI();
        
        // Configura física
        this.setupPhysics();
    }

    /**
     * Cria a pista de teste
     */
    createTrack() {
        // Pista principal (retangular com curvas)
        const trackWidth = this.scale.width - 200;
        const trackHeight = this.scale.height - 200;
        
        // Bordas da pista
        this.trackBounds = {
            left: 100,
            right: this.scale.width - 100,
            top: 100,
            bottom: this.scale.height - 100
        };

        // Desenha a pista
        this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2, 
            trackWidth, 
            trackHeight, 
            0x34495e
        ).setStrokeStyle(4, 0x2c3e50);

        // Linha central
        this.add.line(
            this.scale.width / 2, 
            this.scale.height / 2, 
            0, -trackHeight / 2, 
            0, trackHeight / 2, 
            0xecf0f1, 
            2
        );

        // Linhas laterais
        this.add.line(
            this.scale.width / 2, 
            this.scale.height / 2, 
            -trackWidth / 2, 0, 
            trackWidth / 2, 0, 
            0xecf0f1, 
            2
        );

        // Checkpoints
        this.add.text(this.scale.width / 2, 120, 'START', {
            fontSize: '16px',
            color: '#f39c12',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    /**
     * Cria o carro na pista
     */
    createCar() {
        if (!this.selectedCar) {
            this.showNoCarSelected();
            return;
        }

        // Posição inicial do carro
        const startX = this.scale.width / 2;
        const startY = this.scale.height / 2 + 100;

        // Cria sprite do carro
        this.car = this.physics.add.sprite(startX, startY, null);
        this.car.setDisplaySize(40, 20);
        this.car.setTint(this.selectedCar.paint);
        
        // Configura física do carro
        this.car.setCollideWorldBounds(true);
        this.car.setDrag(0.95);
        this.car.setMaxVelocity(300);
        
        // Propriedades do carro baseadas nas estatísticas
        const stats = this.carManager.getCarStats(this.selectedCar);
        this.car.maxSpeed = stats.topSpeed;
        this.car.acceleration = stats.acceleration;
        this.car.handling = stats.handling;
        this.car.currentSpeed = 0;
    }

    /**
     * Configura controles
     */
    setupControls() {
        // Controles de teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D,SPACE');
        
        // Controles de toque para mobile
        this.createTouchControls();
    }

    /**
     * Cria controles de toque
     */
    createTouchControls() {
        // Botão de aceleração
        this.accelerateBtn = this.add.rectangle(
            this.scale.width - 80, 
            this.scale.height - 80, 
            60, 60, 0x27ae60
        ).setInteractive()
        .on('pointerdown', () => this.touchAccelerate = true)
        .on('pointerup', () => this.touchAccelerate = false)
        .on('pointerout', () => this.touchAccelerate = false);
        
        this.add.text(this.scale.width - 80, this.scale.height - 80, 'A', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Botão de freio
        this.brakeBtn = this.add.rectangle(
            this.scale.width - 80, 
            this.scale.height - 150, 
            60, 60, 0xe74c3c
        ).setInteractive()
        .on('pointerdown', () => this.touchBrake = true)
        .on('pointerup', () => this.touchBrake = false)
        .on('pointerout', () => this.touchBrake = false);
        
        this.add.text(this.scale.width - 80, this.scale.height - 150, 'F', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Botão de freio de mão
        this.handbrakeBtn = this.add.rectangle(
            this.scale.width - 150, 
            this.scale.height - 80, 
            60, 60, 0xf39c12
        ).setInteractive()
        .on('pointerdown', () => this.touchHandbrake = true)
        .on('pointerup', () => this.touchHandbrake = false)
        .on('pointerout', () => this.touchHandbrake = false);
        
        this.add.text(this.scale.width - 150, this.scale.height - 80, 'H', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Inicializa variáveis de toque
        this.touchAccelerate = false;
        this.touchBrake = false;
        this.touchHandbrake = false;
    }

    /**
     * Cria UI da pista
     */
    createTrackUI() {
        // Velocímetro
        this.speedometer = this.add.text(20, 20, 'Velocidade: 0 km/h', {
            fontSize: '16px',
            color: '#ecf0f1',
            fontStyle: 'bold'
        });

        // Informações do carro
        this.carInfo = this.add.text(20, 50, '', {
            fontSize: '14px',
            color: '#bdc3c7'
        });

        // Instruções
        this.add.text(20, this.scale.height - 60, 'Controles: Setas/WASD + Espaço (freio de mão)', {
            fontSize: '12px',
            color: '#95a5a6'
        });

        // Botão de voltar
        const backBtn = this.add.rectangle(100, this.scale.height - 30, 80, 30, 0x34495e)
            .setStrokeStyle(2, 0xecf0f1)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('WorkshopScene', {
                carManager: this.carManager,
                uiManager: this.uiManager
            }))
            .on('pointerover', () => backBtn.setTint(0x2c3e50))
            .on('pointerout', () => backBtn.clearTint());
        
        this.add.text(100, this.scale.height - 30, 'Voltar', {
            fontSize: '12px',
            color: '#ecf0f1'
        }).setOrigin(0.5);
    }

    /**
     * Configura física do jogo
     */
    setupPhysics() {
        // Configura colisões com bordas
        this.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this.car) {
                // Reduz velocidade ao bater
                this.car.setVelocity(
                    this.car.body.velocity.x * 0.5,
                    this.car.body.velocity.y * 0.5
                );
            }
        });
    }

    /**
     * Mostra mensagem quando nenhum carro está selecionado
     */
    showNoCarSelected() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Nenhum Carro Selecionado\n\nVolte à Oficina para selecionar um carro', {
            fontSize: '18px',
            color: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

    update() {
        if (!this.car) return;

        this.handleInput();
        this.updateUI();
        this.updateCamera();
    }

    /**
     * Processa entrada do usuário
     */
    handleInput() {
        const acceleration = this.car.acceleration;
        const maxSpeed = this.car.maxSpeed;
        const handling = this.car.handling;

        // Aceleração
        if (this.cursors.up.isDown || this.wasd.W.isDown || this.touchAccelerate) {
            this.car.setAcceleration(acceleration);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown || this.touchBrake) {
            this.car.setAcceleration(-acceleration * 0.8);
        } else {
            this.car.setAcceleration(0);
        }

        // Rotação
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.car.setAngularVelocity(-handling);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.car.setAngularVelocity(handling);
        } else {
            this.car.setAngularVelocity(0);
        }

        // Freio de mão
        if (this.cursors.space.isDown || this.wasd.SPACE.isDown || this.touchHandbrake) {
            this.car.setDrag(0.8);
        } else {
            this.car.setDrag(0.95);
        }

        // Limita velocidade máxima
        const velocity = this.car.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed > maxSpeed) {
            const factor = maxSpeed / speed;
            this.car.setVelocity(velocity.x * factor, velocity.y * factor);
        }

        // Atualiza velocidade atual
        this.car.currentSpeed = speed;
    }

    /**
     * Atualiza a UI
     */
    updateUI() {
        // Atualiza velocímetro
        this.speedometer.setText(`Velocidade: ${Math.round(this.car.currentSpeed)} km/h`);
        
        // Atualiza informações do carro
        const stats = this.carManager.getCarStats(this.selectedCar);
        this.carInfo.setText(
            `${this.selectedCar.name}\n` +
            `Vel. Máx: ${stats.topSpeed}km/h | ` +
            `Acel: ${stats.acceleration} | ` +
            `Manuseio: ${stats.handling}`
        );
    }

    /**
     * Atualiza a câmera para seguir o carro
     */
    updateCamera() {
        // Câmera segue o carro suavemente
        this.cameras.main.startFollow(this.car, true, 0.05, 0.05);
        
        // Limita a câmera aos limites da pista
        this.cameras.main.setBounds(
            this.trackBounds.left,
            this.trackBounds.top,
            this.trackBounds.right - this.trackBounds.left,
            this.trackBounds.bottom - this.trackBounds.top
        );
    }
}








