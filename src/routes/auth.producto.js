const { Router } = require("express");
const {
  HandleGetProducts,
  HandleNewProduct,
  HandleGetProductById,
  HandleGetProductsByBrand,
  HandleGetProductsByType,
  HandleGetProductsByBody,
  validateToken,
  HandleGetProductsByUser,
  HandleGetLatest5Products,
  updateStock,
} = require("../controller/producto.controller");

const router = Router();  

router.get("/todos", HandleGetProducts);
router.get("/:id([0-9]+)", HandleGetProductById);
router.get("/marca/:marca", HandleGetProductsByBrand);
router.get("/tipo/:tipo", HandleGetProductsByType);
router.get("/cuerpo/:cuerpo", HandleGetProductsByBody);
router.get("/cincoultimos", HandleGetLatest5Products);
router.put("/stock", updateStock);
router.post("/agregar", validateToken, HandleNewProduct);
router.get("/usuario/:id_usuario", HandleGetProductsByUser);

module.exports = router;
