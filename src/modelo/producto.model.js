const { DB } = require("../config/db");
const format = require("pg-format");
// const { errorMiddleware } = require("../middlewares/errorsManager");

const getAllProducts = async () => {
  const result = await DB.query("SELECT * FROM producto;");
  return result.rows;
};

const InsertProduct = async (producto) => {
  const {
    id_usuario,
    nombre,
    marca,
    tipo,
    cuerpo,
    alto,
    ancho,
    precio,
    foto,
    detalle,
    stock,
    color,
  } = producto;

  if (
    !nombre ||
    !marca ||
    !tipo ||
    !cuerpo ||
    !alto ||
    !ancho ||
    !precio ||
    !foto ||
    !detalle ||
    !stock ||
    !color
  ) {
    throw new Error("Faltan campos obligatorios para insertar el producto.");
  }

  const result = await DB.query(
    `INSERT INTO producto (id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`,
    [
      id_usuario,
      nombre,
      marca,
      tipo,
      cuerpo,
      alto,
      ancho,
      precio,
      foto,
      detalle,
      stock,
      color,
    ]
  );
  return result.rows[0];
};
// obtener productos por id usuario
const getProductsByUser = async (id_usuario) => {
  const { rows } = await DB.query(
    "SELECT * FROM producto WHERE id_usuario = $1;",
    [id_usuario]
  );
  return rows;
};

const getProductById = async (id) => {
  const productoId = parseInt(id, 10);
  if (isNaN(productoId)) return null;

  const { rows } = await DB.query(
    "SELECT * FROM producto WHERE id_producto = $1;",
    [productoId]
  );
  return rows[0] || null;
};

const getProductsByBrand = async (marca) => {
  const { rows } = await DB.query(
    "SELECT * FROM producto WHERE marca ILIKE  $1;",
    [marca]
  );
  return rows;
};

const getProductsByType = async (tipo) => {
  const { rows } = await DB.query(
    "SELECT * FROM producto WHERE tipo ILIKE $1;",
    [tipo]
  );
  return rows;
};

const getProductsByBody = async (cuerpo) => {
  const { rows } = await DB.query(
    "SELECT * FROM producto WHERE cuerpo = $1;",
    [cuerpo]
  );
  return rows;
};

const getLatest5Products = async () => {
  try {
    const { rows } = await DB.query(
      'SELECT * FROM producto ORDER BY id_producto DESC LIMIT 5'
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener los últimos 5 productos:", error.message);
    throw new Error("Error al obtener productos");
  }
};

const modifycStock = async (id_producto, cantidad) => {
  try {
    const query = `
      UPDATE producto
      SET stock = stock + $1
      WHERE id_producto = $2
      RETURNING *;
    `;
    const result = await DB.query(query, [cantidad, id_producto]);
    return result.rows[0]; // Retorna el producto actualizado
  } catch (error) {
    throw new Error("Error al modificar el stock: " + error.message);
  }
};

module.exports = {
  getAllProducts,
  InsertProduct,
  getProductById,
  getProductsByBrand,
  getProductsByType,
  getProductsByBody,
  getProductsByUser,
  getLatest5Products,
  modifycStock,
};
