document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 800;
    canvas.height = 600;

    let keysPressed = {};

    const game = new Game(canvas, keysPressed); 

    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('startButton').addEventListener('click', () => {
        game.start(); 
        document.getElementById('startButton').style.display = 'none'; 
    });

    document.getElementById('restartButton').addEventListener('click', () => {
        game.restart();
    });

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true; // Marcar la tecla presionada

        if (!game.gameOver) { 
            if (event.key === ' ') {
                game.shoot();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false; // Marcar la tecla no presionada

        if (!game.gameOver) {
            if (event.key === 'q' || event.key === 'e') {
                game.ship.rotate(0); // Detener rotación
            }
        }
    });
});