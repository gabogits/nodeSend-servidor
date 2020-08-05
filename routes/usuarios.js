const express = require("express");
const router = express.Router();
const { nuevoUsuario } = require("./../controllers/usuarioController");
const { check } = require("express-validator");

router.post(
  "/",
  [
    check("nombre", "El nombre es obliatorio").not().isEmpty(),
    check("email", "El correo no es valido").isEmail(),
    check("password", "El password debe de ser al menos 6 caracteres").isLength({min:6}),
  ],
  nuevoUsuario
);

module.exports = router;
