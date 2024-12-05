import { GAME_CONSTANTS } from '../utils/Constants.js';

export class ScoreService {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.lives = GAME_CONSTANTS.GAME.INITIAL_LIVES;
    }

    addPoints(points) {
        this.score += points;
    }

    decrementLives() {
        if (this.lives > 0) {
            this.lives--;
        }
    }

    getScore() {
        return this.score;
    }

    getLives() {
        return this.lives;
    }

    isGameOver() {
        return this.lives <= 0;
    }
}