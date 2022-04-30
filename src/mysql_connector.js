//importando libreria mysql
const mysql = require("mysql");
//importando libreria dotenv
const dotenv = require("dotenv");
dotenv.config();

//funcion para conectarse a la base de datos
const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

//exportar funcion;
module.exports = connection;
