const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
//const auth = require('./middleware/auth'); la diferencia entre poner el middleware aqui o en routes,
// es que aqui se va ejecutar en cualquier peticion que haga la aliacion aunque no tenga que ver con autentcacion
//app.use(auth) aqui tienes que ocupar app.use para ocuparlo

//crear el servidor
const app = express();

conectarDB();

//habilitar cors
//para limitar las peticiones a un solo origen
const opcionesCors = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(opcionesCors));

//puerto de la app
const port = process.env.PORT || 4000;

//habilitar leer los valores
app.use(express.json());

//Habilitar carpeta publica
app.use(express.static('uploads'))


//rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enlaces", require("./routes/enlaces"));
app.use("/api/archivos", require("./routes/archivos"));
//arrancar la app
app.listen(port, "0.0.0.0", () => {
  console.log(`el servidor esta funcionando en el el puerto ${port}`);
});
