const { DB } = require("../config/db");
const format = require("pg-format");
const { errorMiddleware } = require("../middlewares/errorsManager");

const validateCredentials = async (email, pass) => {
  try {
    const SQLQuery = format(
      `SELECT * FROM usuario WHERE email = %L AND pass = %L`,
      email,
      pass
    );

    const {
      rows: [user],
      rowCount,
    } = await DB.query(SQLQuery);

    if (!rowCount) {
      throw new Error("NOT_FOUND");
    } else {
      return user;
    }
  } catch (error) {
    throw error;
  }
};

const login = async (email, pass) => {
  try {
    const { rows } = await DB.query(
      "SELECT * FROM usuario WHERE email = $1 AND pass = $2",
      [email, pass]
    );

    if (rows.length === 0) {
      throw new Error("AUTH_ERROR");
    }

    return rows[0];
  } catch (error) {
    console.error("Error en el login:", error.message);
    throw new Error("AUTH_ERROR");
  }
};

const checkIfExists = async (email) => {
  try {
    const SQLQuery = "SELECT 1 FROM usuario WHERE email = $1";
    const { rowCount } = await DB.query(SQLQuery, [email]);

    return rowCount > 0; // Devuelve true si existe, false si no
  } catch (error) {
    console.error("Error en checkIfExists:", error);
    throw new Error("ERROR_CHECKING_USER");
  }
};

const register = async (nombre, apellido, email, pass, fono) => {
  try {
    const emailExists = await checkIfExists(email);
    
    if (emailExists) {
      throw new Error("EMAIL_ALREADY_EXISTS"); 
    }

    const SQLQuery = format(
      `INSERT INTO usuario (nombre, apellido, email, pass, fono)
       VALUES (%L, %L, %L, %L, %L)
       RETURNING *`,
      nombre,
      apellido,
      email,
      pass,
      fono
    );

    const { rows, rowCount } = await DB.query(SQLQuery);

    if (!rowCount) {
      throw new Error("BAD_REQUEST");
    }

    return rows[0];
  } catch (error) {
    console.error("Error en register:", error);
    throw error; 
  }
};

const getUserDataByProduct = async (idProducto) => {
  try {
    const query = `
      SELECT u.nombre, u.apellido, u.email, u.fono
      FROM usuario u
      JOIN productos p ON u.id_usuario = p.id_usuario
      WHERE p.id_producto = $1;
    `;
    
    const { rows } = await DB.query(query, [idProducto]);

    if (rows.length === 0) {
      throw new Error("No se encontró el usuario asociado a este producto.");
    }

    return rows[0];
  } catch (error) {
    console.error("Error en getUserDataByProduct:", error.message);
    return [];
  }
};


module.exports = {
  login,
  validateCredentials,
  checkIfExists,
  register,
  getUserDataByProduct,
};
