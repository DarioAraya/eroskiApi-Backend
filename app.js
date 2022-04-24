const express = require("express");
const app = express();
const path = require("path");
const conectando = require("./src/mysql_connector.js");
const ejsMate = require("ejs-mate");
const cors = require("cors");
const eroski = require("./routes/eroskiRoutes");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

conectando.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base");
});

const whiteList = ["http://localhost:3000", "https://api-eroski.herokuapp.com"];

app.use(cors({ origin: whiteList }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", eroski);

//Iniciar servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

//keep alive
setInterval(function () {
  conectando.query("SELECT 1");
}, 4000);
