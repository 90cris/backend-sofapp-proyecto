const { Router } = require("express");

const { handleLogin, handleRegister, getDatosUsuarioPorProducto} = require("../controller/usuario.controller");

const router = Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
// router.get("/producto/:idProducto/usuario", getDatosUsuarioPorProducto);
router.get("/producto/:idProducto", getDatosUsuarioPorProducto);

module.exports = router;
    