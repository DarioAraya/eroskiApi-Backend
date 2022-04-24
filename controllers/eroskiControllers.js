const conectando = require("../src/mysql_connector");

//Querys
const ordenarPor = ["nombreA", "nombreD", "precioA", "precioD"];

let query = `SELECT * FROM product where category = `;
let query2 = "SELECT * FROM category";
let query3 = "SELECT * from product where name LIKE";

//Mostrar todos los productos de la categoria inicial
module.exports.getAll = async (req, res, next) => {
  let id = 1;
  try {
    await conectando.query(`${query} ${id}`, async (err, products) => {
      if (err) res.json({ status: 500, err });
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
  let name = req.body.name;
  let id = req.body.id;
  try {
    if (name.indexOf('"') != -1) {
      name = name.replace(/['"]+/g, "");
    }
    await conectando.query(
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
