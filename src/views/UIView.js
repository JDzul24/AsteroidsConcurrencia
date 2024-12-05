export class UIView {
    constructor() {
        this.scoreElement = document.getElementById('scoreValue');
        this.livesElement = document.getElementById('livesValue');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('finalScore');
    }

    updateScore(score) {
        if (this.scoreElement) {
            this.scoreElement.textContent = score;
        }
    }

    updateLives(lives) {
        if (this.livesElement) {
            this.livesElement.textContent = lives;
        }
    }

    showGameOver(finalScore) {
        if (this.gameOverElement && this.finalScoreElement) {
            this.finalScoreElement.textContent = finalScore;
            this.gameOverElement.classList.remove('hidden');
        }
    }

    hideGameOver() {
        if (this.gameOverElement) {
            this.gameOverElement.classList.add('hidden');
        }
    }
}