const express = require("express");
const router = express.Router();
const {
  autenticarUsuario,
  usuarioAutenticado,
} = require("./../controllers/authController");
const { check } = require("express-validator");
const auth = require('../middleware/auth');

router.post(
  "/",
  [
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password no puede ir vacio").not().isEmpty(),
  ],
  autenticarUsuario
);
//aqui el middleware solo se ocupa en la route/auth, no se ocupa app.use
router.get("/", auth, usuarioAutenticado);

module.exports = router;
