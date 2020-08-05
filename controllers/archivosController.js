const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs')
const Enlaces = require("../models/Enlace");

exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits : {fileSize: req.usuario ? 1024*1024 * 10 : 1024*1024},
        storage: fileStorage = multer.diskStorage({ //diskStorage  en el servidor se va guardar
            destination:(req,file, cb) =>{
                cb(null, __dirname+'/../uploads') // el primer parametro del callback es el error en este caso es null
            },
            filename: (req,file, cb) => {
                // const extension = file.mimetype.split('/')[1]; se mejoro abajo esta linea
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
                
            },
            fileFilter: (req, file, cb) => {
                if(file.mimetype === "application/pdf" ) {
                    return cb(null, true);
                }
            }
    
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo')

    upload(req, res, async( error) => {

        if(!error) {
            res.json({archivo: req.file.filename});
        }else {
            console.log(error);
            return next();
        }
    })
};
exports.eliminarArchivo = async (req, res, next) => {
   try {
    fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`)
   } catch (error) {
       console.log(error)
   }
};

//descarga un archivo 

exports.descargar = async (req, res, next) => {
    //obtiene el enlace
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre: archivo})

    const archivoDescarga = __dirname+ '/../uploads/' + archivo;
    res.download(archivoDescarga);


    const { descargas, nombre } = enlace;
    //si las descargas son iguales a 1 - borrar la entrada y corrar el archivos
    if (descargas === 1) {
     //eliminar el archivo 
     //eliminar la entrada de la DB
     req.archivo = nombre;
      await Enlaces.findOneAndRemove(enlace.id);
      next();
    } else {
      //si las descargas son > a 1 restar 1
      enlace.descargas--;
      await enlace.save();
    }


};