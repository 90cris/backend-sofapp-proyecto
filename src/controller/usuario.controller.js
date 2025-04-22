const { signToken } = require("../helpers/jwt");
const Auth = require("../modelo/usuario.model");
const { obtenerDatosUsuarioPorProducto } = require("../modelo/usuario.model");

const handleLogin = async (req, res, next) => {
  try {
    const { email, pass } = req.body; 

    // verificar si el email está registrado
    const emailExists = await Auth.checkIfExists(email);
    if (!emailExists) {
      return res.status(404).json({ msg: "EMAIL_NOT_FOUND" });
    }

    // Si el email existe, intentamos hacer login
    const user = await Auth.login(email, pass); 

    if (!user) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    const data = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      pass: user.pass, 
      fono: user.fono
    };

    const token = signToken(data);
    res.status(200).json({ 
      token, 
      id_usuario: user.id_usuario, 
      nombre: user.nombre, 
      apellido: user.apellido, 
      email: user.email, 
      pass: user.pass,
      fono: user.fono
    });
  } catch (error) {
    console.error("Error en el login:", error.message); 
    next(error);
  }
};

const handleRegister = async (req, res, next) => {
  try {
    const { nombre, apellido, email, pass, fono } = req.body;

    const user = await Auth.register(nombre, apellido, email, pass, fono);

    res.status(201).json({ msg: "Usuario registrado correctamente", user });
  } catch (error) {
    console.error("Error en el registro:", error);

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(400).json({ msg: "El email ya está registrado. Usa otro." });
    }

    next(error);
  }
};

const getDatosUsuarioPorProducto = async (req, res) => {
  const { idProducto } = req.params;

  try {
    const usuario = await obtenerDatosUsuarioPorProducto(idProducto);
    if (!usuario) {
      return res.status(404).json({ mensaje: "No se encontraron datos para este producto" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};


module.exports = {
  handleLogin,
  handleRegister,
  getDatosUsuarioPorProducto,  
};