import { GameController } from './controllers/GameController.js';
import { GAME_CONSTANTS } from './utils/Constants.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const gameController = new GameController(canvas);

    // Configurar el botón de inicio
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        gameController.start();
        startButton.style.display = 'none';
    });

    // Configurar el botón de reinicio
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', () => {
        gameController.restart();
    });

    // Manejar el redimensionamiento de la ventana
    window.addEventListener('resize', () => {
        canvas.width = GAME_CONSTANTS.CANVAS.WIDTH;
        canvas.height = GAME_CONSTANTS.CANVAS.HEIGHT;
        gameController.gameView.clear();
    });

    // Iniciar música de fondo
    gameController.audioService.playBackground();
});