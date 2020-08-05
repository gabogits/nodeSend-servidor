const express = require("express");
const router = express.Router();
const {
  subirArchivo,
  descargar

} = require("./../controllers/archivosController");
const auth = require('../middleware/auth');
const { eliminarArchivo } = require("./../controllers/archivosController");
router.post(
  "/",
  auth,
  subirArchivo
);

router.get("/:archivo", descargar, eliminarArchivo);


module.exports = router;