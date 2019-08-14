var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido',
            errors: {
                message: 'Tipo de coleccion no valido'
            }
        });
    }

    if (!req.files) {

        res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del Archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover archivo temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    subirPorTipo(tipo, id, archivo, nombreArchivo, res);
});

function subirPorTipo(tipo, id, archivo, nombreArchivo, response) {

    var path = '';

    // ==============================================================
    //  Actualizacion de la BD y carga de imagen para usuario
    // ==============================================================
    if (tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {

            // Si no existe usuario mandar mensaje
            if (!usuario) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            // Validar si el usuario ya cuenta con una imagen para poder eliminarla
            if ((usuario.img.length) > 0) {

                path = './uploads/usuarios/' + usuario.img;

                // Si existe,  elimina la imagen anterior
                if (fs.existsSync(path)) {

                    fs.unlink(path, (error) => {

                        if (error) {
                            return response.status(400).json({
                                ok: false,
                                mensaje: 'No se pudo eliminar la imagen',
                                errors: error
                            });
                        }
                    });
                }
            }

            // Mover el  archivo del temporal a un path
            path = './uploads/usuarios/' + nombreArchivo;

            archivo.mv(path, error => {
                if (error) {

                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: error
                    });
                }
            });

            // ACtualizar la BD
            usuario.img = nombreArchivo;

            usuario.save((error, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return response.status(200).json({

                    ok: true,

                    mensaje: 'imagen de usuario actualizada',

                    usuario: usuarioActualizado

                });
            });
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (error, medico) => {

            // Si no existe medico mandar mensaje
            if (!medico) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }

            // Validar si el medico ya cuenta con una imagen para poder eliminarla
            if ((medico.img.length) > 0) {

                path = './uploads/medicos/' + medico.img;

                // Si existe,  elimina la imagen anterior
                if (fs.existsSync(path)) {

                    fs.unlink(path, (error) => {

                        if (error) {
                            return response.status(400).json({
                                ok: false,
                                mensaje: 'No se pudo eliminar la imagen',
                                errors: error
                            });
                        }
                    });
                }
            }

            // Mover el  archivo del temporal a un path
            path = './uploads/medicos/' + nombreArchivo;

            archivo.mv(path, error => {
                if (error) {

                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: error
                    });
                }
            });

            // ACtualizar la BD
            medico.img = nombreArchivo;

            medico.save((error, medicoActualizado) => {

                medicoActualizado.password = ':)';

                return response.status(200).json({
                    ok: true,
                    mensaje: 'imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (error, hospital) => {

            // Si no existe hospital mandar mensaje
            if (!hospital) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }

            // Validar si el hospital ya cuenta con una imagen para poder eliminarla
            if ((hospital.img.length) > 0) {

                path = './uploads/hospitales/' + hospital.img;

                // Si existe,  elimina la imagen anterior
                if (fs.existsSync(path)) {

                    fs.unlink(path, (error) => {

                        if (error) {
                            return response.status(400).json({
                                ok: false,
                                mensaje: 'No se pudo eliminar la imagen',
                                errors: error
                            });
                        }
                    });
                }
            }

            // Mover el  archivo del temporal a un path
            path = './uploads/hospitales/' + nombreArchivo;

            archivo.mv(path, error => {
                if (error) {

                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: error
                    });
                }
            });

            // ACtualizar la BD
            hospital.img = nombreArchivo;

            hospital.save((error, hospitalActualizado) => {

                hospitalActualizado.password = ':)';

                return response.status(200).json({
                    ok: true,
                    mensaje: 'imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;