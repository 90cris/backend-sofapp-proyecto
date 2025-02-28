const AuthProducto = require("../modelo/producto.model");
const { signToken } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { errorMiddleware } = require("../middlewares/errorsManager");
const {
  getAllProducts,
  InsertProduct,
  getProductById,
  getProductsByBrand,
  getProductsByType,
  getProductsByBody,
  getProductsByUser,
  getLatest5Products,
  modificStock,
} = require("../modelo/producto.model");

const validateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No autorizado. Token no presente." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), String(JWT_SECRET));
    req.user = decoded; // Guardamos los datos decodificados del usuario
    next(); // Continuar con la siguiente función en la ruta
  } catch (error) {
    return res.status(401).json({ error: "No autorizado. Token inválido." });
  }
};

// Obtener todos los producto usuarios
const HandleGetProducts = async (req, res) => {
  try {
    const productos = await getAllProducts();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos." });
  }
};

const HandleNewProduct = async (req, res) => {
  const { id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color } = req.body;

  if (!nombre || !marca || !tipo || !cuerpo || !alto || !ancho || !precio || !foto || !detalle || !stock || !color) {
    return res.status(400).json({ msg: "Los campos obligatorios no pueden estar vacíos." });
  }

  try {
    const response = await InsertProduct(req.body);
    res.status(201).json({ msg: "Producto creado con éxito!", data: response });
  } catch (error) {
    console.error("Error en HandleCrearProducto:", error.message || error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
// obtener productos por el id_usuario
const HandleGetProductsByUser = async (req, res) => {
  try {
    const { id_usuario } = req.params; // Asegúrate de que el frontend pase el id_usuario
    const productos = await getProductsByUser(id_usuario);

    if (!productos.length) {
      return res.status(404).json({ msg: "No se encontraron productos para este usuario." });
    }

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos del usuario.", error: error.message });
  }
};

//
const HandleGetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await getProductById(id);

    if (!producto) {
      return res.status(404).json({ msg: "No se encontró el producto con ese ID o el formato es incorrecto." });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error.message);
    res.status(500).json({ msg: "Error interno del servidor.", error: error.message });
  }
};

// Obtener productos por Marca 
const HandleGetProductsByBrand = async (req, res) => {
  try {
    const { marca } = req.params;
    const productos = await getProductsByBrand(marca);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos por marca.", error: error.message });
  }
};

// Obtener productos por Tipo 
const HandleGetProductsByType = async (req, res) => {
  try {
    const { tipo } = req.params;
    const productos = await getProductsByType(tipo);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos por tipo.", error: error.message });
  }
};

// Obtener productos por Cuerpo 
const HandleGetProductsByBody = async (req, res) => {
  try {
    const { cuerpo } = req.params;
    const productos = await getProductsByBody(cuerpo);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos por cuerpo.", error: error.message });
  }
};

const HandleGetLatest5Products = async (req, res) => {
  try {
    const productos = await getLatest5Products();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en la petición:", error.message);
    res.status(500).json({ msg: "Error al obtener los productos" });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;

    if (!id_producto || cantidad === undefined) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const cantidadNumerica = Number(cantidad);
    if (isNaN(cantidadNumerica)) {
      return res.status(400).json({ error: "Cantidad debe ser un número válido" });
    }

    const productoActualizado = await modificStock(id_producto, cantidadNumerica);
    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Stock actualizado correctamente", producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  validateToken,
  HandleGetProducts,
  HandleNewProduct,
  HandleGetProductById,
  HandleGetProductsByBrand,
  HandleGetProductsByType,
  HandleGetProductsByBody,
  HandleGetProductsByUser,
  HandleGetLatest5Products,
  updateStock,
};