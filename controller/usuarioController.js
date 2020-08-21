const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const err =  validationResult(req);
    if(!err.isEmpty()){
        res.status(400).json({err: err.array()});
    }

    // Destructuring (extraer email y password)
    const {email, password} = req.body;    

    try {

        // Validar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'})
        }

        // Crea el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password()
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)

        // Guarda el nuevo usuario
        await usuario.save();

        // Crear y firmar el JWT
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

        // Mensaje de confirmacion
        // res.json({msg: 'Usuario creado correctamente'});

    } catch (error) {
        console.info(error);
        // Mensaje de error
        res.status(400).send('Hubo un error');
    }
}