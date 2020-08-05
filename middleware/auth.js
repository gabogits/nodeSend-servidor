const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization')
  if(authHeader){
      //Obtener el token
      const token = authHeader.split(' ')[1];

      try {
        const usuario = jwt.verify(token, process.env.SECRETA);
        //console.log("desde eñ middleware", usuario)
        req.usuario = usuario;
        //res.json({usuario});
      } catch (error) {
        console.log(error)
        console.log("jwt no válido");
      }
    
  }
  console.log("no hay header")
    return next();
}