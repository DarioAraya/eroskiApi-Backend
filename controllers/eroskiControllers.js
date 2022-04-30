//importando metodo para conectarse a la base
const conectando = require("../src/mysql_connector");

//Arrays de Datos
const products = [];

const ordenarPor = ["nombreA", "nombreD", "precioA", "precioD"];
//Querys
let sql = `SELECT * FROM product where category = ?`;
let sql2 = "SELECT * FROM category";
let sql3 = "SELECT * FROM product WHERE name LIKE ? AND category = ?";
//Funcion para llamar a las categorias
const getCategories = async () => {
  const query = await conectando.query(`${sql2}`);
  return query;
};

//Id Constante
const defaultId = 1;

//funcion para identificar cual es el orden que se eligio
const sortProducts = (sortBy) => {
  let sortSql = "";
  if (sortBy === "nombreA") {
    sortSql = `${sql} ORDER BY name`;
  }

  if (sortBy === "nombreD") {
    sortSql = `${sql} ORDER BY name DESC`;
  }

  if (sortBy === "precioA") {
    sortSql = `${sql} ORDER BY price DESC`;
  }

  if (sortBy === "precioD") {
    sortSql = `${sql} ORDER BY price`;
  }

  return sortSql;
};

//Mostrar todos los productos de la categoria inicial
module.exports.getAll = async (req, res, next) => {
  //llamando a la funcion que trae las categorias
  const categories = await getCategories();
  try {
    //se realiza la consulta a la base de datos ingresando la query y el por defecto id
    const query = await conectando.query(`${sql}`, [defaultId]);
    //si hay un problema con la primera query, retornar array por defecto
    if (!query || query.length === 0) {
      return res.json({ products, categories, ordenarPor });
    }
    //Si no hay problemas con la query, retornar arrays reemplazando products con el array entregado en la query
    return res.json({ products: query, categories, ordenarPor });
  } catch (err) {
    console.log(err);
    return res.json({ products, categories, ordenarPor });
  }
};

//filtrar por nombre
module.exports.findForName = async (req, res, next) => {
  //para traer el valor de la variable name en el body
  let { name, id } = req.body;
  const categories = await getCategories();
  //para evitar el error ERR_HTTP_HEADERS_SENT
  if (!name || name.length === 0 || !id || id.length === 0) {
    return res.json({ products, categories, ordenarPor });
  }

  try {
    //este if sirve para evitar un error en el input buscar, ya que poner comillas o doble comillas produce conflicto con las querys
    if (name.match(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi)) {
      name = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
    }
    name = `%${name}%`;
    //se realiza la consulta a la base de datos ingresando la query, el nombre y el id
    const query = await conectando.query(`${sql3}`, [name, id]);

    if (!query || query.length === 0) {
      return res.json({ products, categories, ordenarPor });
    }
    return res.json({ products: query, categories, ordenarPor });
  } catch (err) {
    console.log(err);
    return res.json({ products, categories, ordenarPor });
  }
};

//filtrar por categoria
module.exports.findByCat = async (req, res, next) => {
  let { id } = req.body;
  const categories = await getCategories();

  if (!id || id.length === 0) {
    return res.json({ products, categories, ordenarPor });
  }

  try {
    //se realiza la consulta a la base de datos ingresando la query y el id
    const query = await conectando.query(`${sql}`, [id]);

    if (!query || query.length === 0) {
      return res.json({ products, categories, ordenarPor });
    }
    return res.json({ products: query, categories, ordenarPor });
  } catch (err) {
    console.log(err);
    return res.json({ products, categories, ordenarPor });
  }
};

//ordenar por
module.exports.sortBy = async (req, res, next) => {
  let { id, sortBy } = req.body;
  const categories = await getCategories();
  //modificar query3 segun el orden que se escoge

  if (!sortBy || sortBy.length === 0 || !id || id.length === 0) {
    return res.json({ products, categories, ordenarPor });
  }
  //se llama a la funcion sortProducts añadiendo el valor en el sortBy para que nos returne la query que deseamos
  const sortSql = sortProducts(sortBy);

  try {
    //se realiza la consulta a la base de datos ingresando la query y el id
    const query = await conectando.query(`${sortSql}`, [id]);

    if (!query || query.length === 0) {
      return res.json({ products, categories, ordenarPor });
    }
    return res.json({ products: query, categories, ordenarPor });
  } catch (err) {
    console.log(err);
    return res.json({ products, categories, ordenarPor });
  }
};
