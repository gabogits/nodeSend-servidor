const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const { validationResult } = require("express-validator");
const Enlaces = require("../models/Enlace");
const shortid = require("shortid");

exports.nuevoEnlace = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Crear un objeto del Enlaces
  const { nombre_original, nombre } = req.body;
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;

  //si el usuario esta autenticado
  if (req.usuario) {
    const { password, descargas } = req.body;

    //asignar a enlace el número de descargas
    if (descargas) {
      enlace.descargas = descargas;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }
    //asignar el autor
    enlace.autor = req.usuario.id;
  }
  //eliminar en la BD
  try {
    await enlace.save();
    return res.json({ msg: `${enlace.url}` });
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.todosEnlaces  = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select('url -_id');
    res.json({enlaces})
  } catch (error) {
    console.log(error)
  }
}
//retorna si el enlace tiene pasword o no

exports.tienePassword = async (req, res, next) => {
  const { url } = req.params;
  //verificar si existe el enlace

  const enlace = await Enlaces.findOne({ url });

  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }

  if (enlace.password) {
    return res.json({ password: true, enlace: enlace.url});
  
  }
  next();
}

exports.verificarPassword = async (req, res, next) => {
const {url} = req.params;
const {password } = req.body;
//consultar por el enlace
const enlace =  await Enlaces.findOne({ url });

//verificar el password

if(bcrypt.compareSync(password, enlace.password)) {
  //permitirle al usuario descargar el archivo
   next()
}else{
  return res.status(401).json({msg: 'Password Incorrecto'});

}
  
};

exports.obtenerEnlace = async (req, res, next) => {
  const { url } = req.params;
  //verificar si existe el enlace

  const enlace = await Enlaces.findOne({ url });
//console.log(enlace)
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }
  //si el enlace existe
  res.json({ archivo: enlace.nombre, password: false });
//una solucion pudo se   res.download({ archivo: enlace.nombre }); , pero seria modificar muchas cosas del proyecto, por que tenemos el nombre del archivo en muchos lugares
  next();
 
  
};


