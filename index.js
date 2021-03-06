const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors')


// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();

// Habilitar cors
app.use(cors());

// Habiitar express.json
app.use(express.json({extended: true}));

// Puerto de la app
const port = process.env.port || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));



// Definir la pagina principal
// app.get('/', (req, res) => {
//     res.send('hola mundo');
// })

// Run Servidor
app.listen(port, '.0.0.0.0', () => {
    console.info(`el servidor esta corriendo en el puerto ${port}`);
});