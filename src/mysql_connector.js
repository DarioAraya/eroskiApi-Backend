//importando libreria mysql
const mysql = require("mysql");
//llamando al modulo util para poder usar el metodo promisify
const util = require("util");
//importando libreria dotenv
const dotenv = require("dotenv");
dotenv.config();

//llamando a los parametros secretos para la conexion a la base
const config = {
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
};

//funcion para conectarse a la base de datos
const asyncDB = (config) => {
  const connection = mysql.createConnection(config);
  //usando promisify para convertir la funcion connection en una promesa.
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
};

const connection = asyncDB(config);

//exportar funcion;
module.exports = connection;
