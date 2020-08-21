const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores
    const err =  validationResult(req);
    if(!err.isEmpty()){
        res.status(400).json({err: err.array()});
    }

    // Destructuring (extraer email y password)
    const {email, password} = req.body;    

    try {

        // Validar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'})
        }

        // Revisar el password()
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password incorrecto'})
        }

        // Si todo es correcto crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el jsonwebtoken(JWT)
        jwt.sign(payload, 'palabrasecreta', {
            expiresIn: 3600 // 1Hora
        }, (error, token) => {
            if(error) throw error;
            // Mensaje de confirmacion
            res.json({ token });
        });

        // // Mensaje de confirmacion
        // // res.json({msg: 'Usuario creado correctamente'});

    } catch (error) {
        console.info(error);
    }
}

// Obtiene que usuario esta autenticado 
exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.info(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}