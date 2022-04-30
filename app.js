//importando express
const express = require("express");
const app = express();
//importando el metodo para conectar a la base
const conectando = require("./src/mysql_connector.js");
const cors = require("cors");
//importanto las rutas
const eroski = require("./routes/eroskiRoutes");

//Lista blanca con las rutas permitidas para hacer consultas al backend
const whiteList = ["http://localhost:3000", "https://api-eroski.herokuapp.com"];
app.use(cors({ origin: whiteList }));

//parsear json
app.use(express.json());
//recibir parametros a traves de query
app.use(express.urlencoded({ extended: false }));

app.use("/", eroski);

//Iniciar servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

//keep alive
setInterval(async function () {
  const query = await conectando.query("SELECT 1");
}, 4000);
