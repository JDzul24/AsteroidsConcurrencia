// workers/disparosWorker.js
self.addEventListener('message', (event) => {
    const { disparosData, canvasDimensions } = event.data;

    // Verificar que disparosData sea un array
    if (!Array.isArray(disparosData)) {
        console.error('disparosData no es un array:', disparosData);
        return;
    }

    const updatedDisparosData = disparosData.map(disparo => {
        disparo.x += disparo.velocity.x;
        disparo.y += disparo.velocity.y;

        // Eliminar disparos fuera de la pantalla
        const { width, height } = canvasDimensions;

        if (
            disparo.x < 0 || disparo.x > width ||
            disparo.y < 0 || disparo.y > height
        ) {
            return null; // Marcar para eliminar
        }

        return disparo;
    }).filter(disparo => disparo !== null); // Filtrar los marcados para eliminar

    self.postMessage({ updatedDisparosData });
});