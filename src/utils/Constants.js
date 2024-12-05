export const GAME_CONSTANTS = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    
    CONTROLS: {
        KEYS: {
            ACCELERATE: 'w',
            ROTATE_LEFT: 'q',
            ROTATE_RIGHT: 'e',
            SHOOT: ' ',
            PAUSE: 'escape'
        },
        SHOOT_COOLDOWN: 250, // milisegundos entre disparos
        KEY_MAP: {
            w: 'accelerate',
            q: 'rotateLeft',
            e: 'rotateRight',
            ' ': 'shoot',
            escape: 'pause'
        }
    },


    SHIP: {
        RADIUS: 20,
        ACCELERATION: 1,
        MAX_SPEED: 2,
        FRICTION: 0.3,
        ROTATION_SPEED: 2,
        SPRITE: {
            WIDTH: 64,
            HEIGHT: 64
        }
    },
    
    ASTEROID: {
        MIN_SIZE: 1,
        MAX_SIZE: 3,
        BASE_RADIUS: 10,  // Se multiplica por el size
        MIN_SPEED: -1,
        MAX_SPEED: 1,
        INITIAL_COUNT: 5,

        // Nuevas constantes específicas
        SPLIT_COUNT: 2,          // Número de asteroides al dividirse
        SPLIT_SPEED_MIN: 0.5,    // Velocidad mínima al dividirse
        SPLIT_SPEED_MAX: 1.5,    // Velocidad máxima al dividirse
        ROTATION: {
            MIN_SPEED: 0.01,     // Velocidad mínima de rotación
            MAX_SPEED: 0.03      // Velocidad máxima de rotación
        },
        SPRITES: {
            WIDTH: 64,           // Ancho del sprite
            HEIGHT: 64           // Alto del sprite
        }
    },
    
    BULLET: {
        RADIUS: 10,
        SPEED: 5,
        LIFESPAN: 60  // frames
    },
    
    GAME: {
        INITIAL_LIVES: 3,
        POINTS_PER_ASTEROID: 100,
        LEVEL_UP_THRESHOLD: 1000
    },

    WORKER_MESSAGES: {
        // Tipos de mensajes para los workers
        COLLISION: {
            CHECK: 'CHECK_COLLISIONS',
            RESULT: 'COLLISION_RESULTS'
        },
        UPDATE: 'UPDATE',
        CREATE: 'CREATE',
        REMOVE: 'REMOVE',
        INIT: 'INIT'
    }
};

export const ASSET_PATHS = {
    IMAGES: {
        SHIP: '/src/assets/images/nave.gif',
        ASTEROID: '/src/assets/images/asteroide.png'
    },
    SOUNDS: {
        SHOOT: '/src/assets/sounds/disparo.wav',
        EXPLOSION: '/src/assets/sounds/explosion.wav',
        BACKGROUND: '/src/assets/sounds/S3K_FinalBoos_Theme.mp3'
    }
};