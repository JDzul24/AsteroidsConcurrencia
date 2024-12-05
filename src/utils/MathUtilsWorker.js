const MathUtils = {
    randomFloat: (min, max) => Math.random() * (max - min) + min,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    degToRad: (degrees) => degrees * Math.PI / 180,
    distanceBetween: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
};

// Hacer disponible MathUtils en el contexto del worker
self.MathUtils = MathUtils;