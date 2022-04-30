//importando metodo para conectarse a la base
const conectando = require("../src/mysql_connector");

//Querys
const ordenarPor = ["nombreA", "nombreD", "precioA", "precioD"];
let query = `SELECT * FROM product where category = `;
let query2 = "SELECT * FROM category";
let query3 = "SELECT * from product where name LIKE";
("a");
//Mostrar todos los productos de la categoria inicial
module.exports.getAll = async (req, res, next) => {
  let id = 1; //Se inicializa el id en 1 ya que es la primera categoria a mostrar
  try {
    //se realiza la consulta a la base de datos añadiendo la query y el id
    await conectando.query(`${query} ${id}`, async (err, products) => {
      if (err) res.json({ status: 500, err });
      //se la segunda consulta para traer las categorias
      conectando.query(query2, (err, categories) => {
        if (err) res.json({ status: 500, err });
        res.json({ products, categories, ordenarPor });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

//filtrar por nombre
module.exports.findForName = async (req, res, next) => {
  //para traer el valor de la variable name en el body
  let name = req.body.name;
  //para traer el valor de la variable name en el body
  let id = req.body.id;
  //Evitar que los parametros vengan vacios
  if (!name || !id) {
    return res.sendStatus(200).json({
      // Manejo del error ERR_HTTP_HEADERS_SENT
      status_code: 0,
      error_msg: "Require Params Missing",
    });
  }
  try {
    //este if sirve para evitar un error en el input buscar, ya que poner comillas o doble comillas produce conflicto con las querys
    if (name.includes('"')) {
      name = name.replace(/['"]+/g, "");
    }
    if (name.includes("'")) {
      name = name.replace(/["']+/g, "");
    }

    console.log(name);
    await conectando.query(
      //query para filtrar por nombre y mantenerse en la categoria.
      `${query3} '%${name}%' AND category=${id}`,
      (err, products) => {
        if (err) res.json({ status: 500, err });
        conectando.query(query2, (err, categories) => {
          if (err) res.json({ status: 500, err });
          res.json({ products, categories, ordenarPor });
        });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

//filtrar por categoria
module.exports.findByCat = async (req, res, next) => {
  let id = req.body.id;
  try {
    await conectando.query(`${query} '${id}'`, (err, products) => {
      if (err) res.json({ status: 500, err });
      conectando.query(query2, (err, categories) => {
        if (err) res.json({ status: 500, err });
        res.json({ products, categories, ordenarPor });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

//ordenar por
module.exports.sortBy = async (req, res, next) => {
  let sortBy = req.body.sortBy;
  let id = req.body.id;
  try {
    //modificar query3 segun el orden que se escoge
    if (sortBy === "nombreA") {
      var query3 = `${query} '${id}' ORDER BY name`;
    } else if (sortBy === "nombreD") {
      var query3 = `${query} '${id}' ORDER BY name DESC`;
    } else if (sortBy === "precioA") {
      var query3 = `${query} '${id}' ORDER BY price DESC`;
    } else if (sortBy === "precioD") {
      var query3 = `${query} '${id}' ORDER BY price`;
    } else {
      var query3 = `${query} '${id}'`;
    }
    conectando.query(query3, async (err, products) => {
      if (err) res.json({ status: 500, err });
      await conectando.query(query2, (err, categories) => {
        if (err) res.json({ status: 500, err });
        res.json({ products, categories, ordenarPor });
      });
    });
  } catch (err) {
    console.log(err);
  }
};
