const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// Middleware para parsear JSON y habilitar CORS
app.use(bodyParser.json());
app.use(cors({
    domains: '*',
    methods: '*'
}));

// Conexión a la base de datos
mongoose.connect('mongodb+srv://JoselynTijerino:JoselynTijerino@cluster0.6sdzi3m.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Importar los controladores y el middleware de autenticación
const { careerGet, careerPost, careerPut, careerDelete } = require('./server/controllers/careerController');
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('./server/controllers/userController');
const authMiddleware = require('./server/middleware/authMiddleware');

// Rutas de carreras protegidas con token JWT
app.get('/api/career', authMiddleware, careerGet);
app.post('/api/career', authMiddleware, careerPost);
app.put('/api/career', authMiddleware, careerPut);
app.delete('/api/career', authMiddleware, careerDelete);

// Rutas de usuario sin protección (registro y login)
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.get('/api/user/:id', getUser);
app.put('/api/user/:id', updateUser);
app.delete('/api/user/:id', deleteUser);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
