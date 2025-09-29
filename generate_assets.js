// Script para gerar assets placeholder
// Execute com: node generate_assets.js

const fs = require('fs');
const path = require('path');

// Função para criar imagem PNG simples
function createPNG(width, height, color, text) {
    // Cria um canvas virtual
    const canvas = {
        width: width,
        height: height,
        data: new Uint8ClampedArray(width * height * 4)
    };
    
    // Preenche com cor de fundo
    for (let i = 0; i < canvas.data.length; i += 4) {
        canvas.data[i] = parseInt(color.slice(1, 3), 16);     // R
        canvas.data[i + 1] = parseInt(color.slice(3, 5), 16); // G
        canvas.data[i + 2] = parseInt(color.slice(5, 7), 16); // B
        canvas.data[i + 3] = 255; // A
    }
    
    // Cria PNG simples (formato básico)
    const png = createSimplePNG(canvas);
    return png;
}

function createSimplePNG(canvas) {
    // Implementação simplificada de PNG
    const width = canvas.width;
    const height = canvas.height;
    const data = canvas.data;
    
    // Cria um PNG básico com dados RGB
    const pngData = Buffer.alloc(width * height * 3 + 1000);
    let offset = 0;
    
    // Header PNG
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    pngSignature.copy(pngData, offset);
    offset += 8;
    
    // Para simplificar, vamos criar um arquivo de texto que representa a imagem
    return `PNG_PLACEHOLDER_${width}x${height}_${canvas.data.length}`;
}

// Cria os assets
function generateAssets() {
    console.log('Gerando assets placeholder...');
    
    // Cria pasta assets se não existir
    if (!fs.existsSync('assets')) {
        fs.mkdirSync('assets');
    }
    if (!fs.existsSync('assets/ui')) {
        fs.mkdirSync('assets/ui');
    }
    
    // Carros
    const cars = [
        { name: 'car_01', color: '#FF0000', text: 'Fusca' },
        { name: 'car_02', color: '#00FF00', text: 'Kombi' },
        { name: 'car_03', color: '#0000FF', text: 'Brasília' },
        { name: 'car_04', color: '#FFFF00', text: 'Opala' },
        { name: 'car_05', color: '#FF00FF', text: 'Monza' }
    ];
    
    cars.forEach(car => {
        const pngData = createPNG(100, 60, car.color, car.text);
        fs.writeFileSync(`assets/${car.name}.png`, pngData);
        console.log(`Criado: assets/${car.name}.png`);
    });
    
    // UI Elements
    const buttonData = createPNG(100, 40, '#3498db', 'Button');
    fs.writeFileSync('assets/ui/button.png', buttonData);
    console.log('Criado: assets/ui/button.png');
    
    const panelData = createPNG(200, 150, '#34495e', 'Panel');
    fs.writeFileSync('assets/ui/panel.png', panelData);
    console.log('Criado: assets/ui/panel.png');
    
    console.log('Assets gerados com sucesso!');
}

// Executa se chamado diretamente
if (require.main === module) {
    generateAssets();
}

module.exports = { generateAssets };








