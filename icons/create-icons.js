// Script pour créer les icônes PNG
function createIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Cercle blanc
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Note de musique
    const noteSize = size * 0.15;
    const noteX = size * 0.35;
    const noteY = size * 0.4;
    
    ctx.fillStyle = '#6366f1';
    // Tête de note
    ctx.beginPath();
    ctx.ellipse(noteX + noteSize, noteY + noteSize * 2, noteSize * 0.4, noteSize * 0.3, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tige de note
    ctx.fillRect(noteX + noteSize * 1.2, noteY, noteSize * 0.15, noteSize * 1.5);
    
    // Geste de main
    const handX = size * 0.3;
    const handY = size * 0.6;
    const handSize = size * 0.2;
    
    ctx.fillStyle = '#6366f1';
    // Paume
    ctx.beginPath();
    ctx.ellipse(handX + handSize, handY + handSize * 0.8, handSize * 0.6, handSize * 0.4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Index étendu
    ctx.beginPath();
    ctx.ellipse(handX + handSize * 0.7, handY + handSize * 0.3, handSize * 0.15, handSize * 0.6, -0.2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Majeur étendu
    ctx.beginPath();
    ctx.ellipse(handX + handSize, handY + handSize * 0.3, handSize * 0.15, handSize * 0.6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ondes sonores
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = Math.max(1, size * 0.01);
    
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(size * 0.7, size * 0.3, size * 0.1 + i * size * 0.05, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    return canvas.toDataURL('image/png');
}

// Fonction pour télécharger les icônes
function downloadIcon(size) {
    const dataUrl = createIcon(size);
    const link = document.createElement('a');
    link.download = `icon-${size}.png`;
    link.href = dataUrl;
    link.click();
}

// Générer les icônes
console.log('Icône 192x192:', createIcon(192));
console.log('Icône 512x512:', createIcon(512));

// Télécharger automatiquement
downloadIcon(192);
downloadIcon(512);
