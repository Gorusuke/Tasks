const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');


// Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // Revisar si hay Errores
    const err =  validationResult(req);
    if(!err.isEmpty()){
        res.status(400).json({err: err.array()});
    }


    try {
        // Extraer el proyecto y comprobar que existe
        const {proyecto} = req.body;

        // Crear un nuevo proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario utenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea})

    } catch (error) {
        console.info(error);
        res.status(500).send('Hubo un error')
    }
}

// Obtiene las tareas por proyectos
exports.obtenerTarea = async (req, res) => {

    try {
        // Extraer el proyecto y comprobar que existe
        const {proyecto} = req.query;

        // Crear un nuevo proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Obtener las tareas
        const tareas = await Tarea.find({proyecto}).sort({creado: -1})
        res.json({tareas})

    } catch (error) {
        console.info(error);
        res.status(500).send('Hubo un error')
    }
}

// Actualiza una tarea
exports.actualizarTarea = async (req, res) => {

    try {
        // Extraer el proyecto y comprobar que existe
        const {proyecto, nombre, estado} = req.body;

        // Revisar si la tarea existe o no
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).json({msg: 'No existe esa tarea'})
        }

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Crear un objeto con la nueva informacion
        let nuevaTarea = {};
        nuevaTarea.nombre = nombre;        
        nuevaTarea.estado = estado;

        // Guardar la tarea
        tareaExiste = await Tarea.findByIdAndUpdate({_id: req.params.id}, nuevaTarea, {new: true})
        res.json({tareaExiste});

    } catch (error) {
        console.info(error);
        res.status(500).send('Hubo un error')
    }
}

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar que existe
        const {proyecto} = req.query;

        // Revisar si la tarea existe o no
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).json({msg: 'No existe esa tarea'})
        }

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        // Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'});


    } catch (error) {
        console.info(error);
        res.status(500).send('Hubo un error')
    }
}