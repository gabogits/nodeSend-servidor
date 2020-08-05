const express = require("express");
const router = express.Router();
const {
  nuevoEnlace,
  obtenerEnlace,
  todosEnlaces,
  tienePassword,
  verificarPassword
} = require("./../controllers/enlacesController");

const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",
  auth,
  [
    check("nombre", "Sube un archivo").not().isEmpty(),
    check("nombre_original", "Sube un archivo").not().isEmpty(),
  ],
  nuevoEnlace
);
router.get('/', todosEnlaces)

router.get("/:url", tienePassword, obtenerEnlace);
router.post("/:url", verificarPassword, obtenerEnlace);


module.exports = router;
