import { ASSET_PATHS } from '../utils/Constants.js';

export class AudioService {
    constructor() {
        this.sounds = {
            shoot: new Audio(ASSET_PATHS.SOUNDS.SHOOT),
            explosion: new Audio(ASSET_PATHS.SOUNDS.EXPLOSION),
            background: new Audio(ASSET_PATHS.SOUNDS.BACKGROUND)
        };

        this.sounds.background.loop = true;
        this.isMuted = false;
    }

    playShoot() {
        if (!this.isMuted) {
            this.sounds.shoot.currentTime = 0;
            this.sounds.shoot.play();
        }
    }

    playExplosion() {
        if (!this.isMuted) {
            this.sounds.explosion.currentTime = 0;
            this.sounds.explosion.play();
        }
    }

    playBackground() {
        if (!this.isMuted) {
            this.sounds.background.play();
        }
    }

    pauseBackground() {
        this.sounds.background.pause();
    }

    stopBackground() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopAll();
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    destroy() {
        this.stopAll();
    }
}