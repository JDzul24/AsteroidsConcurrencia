document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 800;
    canvas.height = 600;

    let keysPressed = {};

    window.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });

    const game = new Game(canvas, keysPressed);

    document.getElementById('startButton').addEventListener('click', () => {
        game.start();
        document.getElementById('start-container').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
    });

    document.getElementById('restartButton').addEventListener('click', () => {
        game.restart();
    });
});
