const express = require("express");
const router = express.Router();
const {
  getAll,
  findForName,
  findByCat,
  sortBy,
} = require("../controllers/eroskiControllers");

//Mostrar todos los productos de la categoria inicial
router.get("/all-products", getAll);

//filtrar por nombre
router.post("/find-for-name", findForName);

//filtrar por categoria
router.post("/filter-by-cat", findByCat);

//ordenar por
router.post("/sort-by", sortBy);

module.exports = router;
