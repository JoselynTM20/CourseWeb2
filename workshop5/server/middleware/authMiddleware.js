const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Verificar si hay un token en el header de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extraer el token de la cabecera
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded; // Añadir el usuario decodificado a la solicitud para su uso posterior
        next(); // Permitir que la solicitud continúe
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;

