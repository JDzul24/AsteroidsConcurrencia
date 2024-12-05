// workers/utilsWorker.js
self.addEventListener('message', (event) => {
    const { shipData, asteroidsData, disparosData } = event.data;

    let collisionDetected = false;
    let asteroidHitIndex = -1; // Para el asteroide
    let disparoHitIndex = -1;

    for (let i = 0; i < asteroidsData.length; i++) {
        const asteroid = asteroidsData[i];
        const distance = Math.sqrt((shipData.x - asteroid.x) ** 2 + (shipData.y - asteroid.y) ** 2);
        if (distance < shipData.radius + asteroid.radius) {
            collisionDetected = true;
            asteroidHitIndex = i; // Guarda el índice del asteroide que colisionó
            break; // Sale del bucle si hay colisión
        }

        // Colisiones disparo-asteroide
        for (let j = 0; j < disparosData.length; j++) {
            const disparo = disparosData[j];
            const distanceDisparoAsteroide = Math.sqrt((asteroid.x - disparo.x) ** 2 + (asteroid.y - disparo.y) ** 2);

            if (distanceDisparoAsteroide < asteroid.radius) {
                asteroidHitIndex = i;
                disparoHitIndex = j;
                collisionDetected = true;
                break;
            }
        }
    }

    self.postMessage({ collisionDetected, asteroidHitIndex, disparoHitIndex });
});