// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {check} = require('express-validator');
const auth = require('../middleware/auth');

// Iniciar sesion
// api/auth
router.post('/', 
    // [
    //     check('email', 'Agrega un email valido').isEmail(),
    //     check('password', 'El password es minimo de 6 caracteres').isLength({min: 6})
    // ],
    authController.autenticarUsuario
);

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;