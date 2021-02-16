const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../../util/logger");

const dbConnection = require("../../../database");
const {
  queryStringSelect,
  queryStringUpdate,
  queryStringCreate,
} = require("./admins.helper");

const usuariosCtrl = {};

// Descifrar contraseña; Esto mover a helper
const validatePassword = function (password_1, password_2) {
  return bcrypt.compare(password_1, password_2);
};

// GET obtener Administradores
usuariosCtrl.getAdmins = (req, res) => {
  console.log(req.query);
  let response = queryStringSelect(req.query);
  dbConnection.query(response.sql, response.params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      throw err;
    } else {
      res.status(200).json(row.rows);
    }
  });
};

// POST crear Admins
usuariosCtrl.createAdmins = async (req, res) => {
  let response = await queryStringCreate(req); // Creo la petición para crear al usuario
  dbConnection.run(response.sql, response.params, function (err) {
    if (err) {
      // Si la petición me devuelve un error, es un error interno, pero el error interno puede ser de email duplicado
      if (err.errno == 19) {
        logger.error(
          `Ya existe administrador registrado con el email [${req.body.email}]`
        );
        res
          .status(500)
          .send(
            `Ya existe administrador registrado con el email [${req.body.email}]`
          );
      } else {
        logger.error(err);
        res.status(500).send(`Error interno en el Servidor`);
      }
    } else {
      // Crear el token
      const token = jwt.sign(
        { id: req.body.email },
        process.env.SECRETJWT || "Estos_es*unSECreto",
        {
          expiresIn: 60 * 60 * 24, // El token vence en un día.
        }
      );
      logger.info(
        `Administrador creado exitosamente para el email [${req.body.email}]`
      );
      res.status(200).json({
        admin: {
          name: req.body.name,
          email: req.body.email,
        },
        token: token,
      });
    }
  });
};

// POST Login de Admins
usuariosCtrl.loginAdmins = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Busco si existe admin para este  email.
  let sql = `SELECT * FROM admins WHERE email = $1`;
  dbConnection.query(sql, [email], async (err, row) => {
    // dbConnection.get(sql, [email], async (err, row) => {
    if (err) {
      res.status(500).send(`Error interno en el Servidor`);
      logger.error(err);
    } else {
      if (row.rowCount > 0) {
        // Si existe el usuario con este email, validamos contraseña
        console.log(row.rows);
        const validarPassword = await validatePassword(
          password,
          row.rows[0].password
        );
        if (!validarPassword) {
          logger.info(
            `Contraseña incorrecta para iniciar sesión con el email [${email}]`
          );
          return res
            .status(400)
            .json(
              `Contraseña incorrecta para iniciar sesión con el email [${email}]`
            );
        } else {
          // Si las contraseñas son iguales, generamos el token genero token al iniciar sesión y enviar token

          const token = jwt.sign(
            { id: email },
            process.env.SECRETJWT || "Estos_es*unSECreto",
            {
              expiresIn: 60 * 60 * 24, // Vence en 24hs
            }
          );
          res.status(200).json({ admin: row, token: token });
          logger.info("Sesión iniciada exitosamente");
        }
      } else {
        {
          logger.info(`No hay cuenta registrada para el email [${email}]`);
          return res
            .status(400)
            .send(`No hay cuenta registrada para el email [${email}]`);
        }
      }
    }
  });
};

//GET Ruta Perfil (Prueba Autorización) OJO!!!! La validación la hago con el email, no con el ID.
usuariosCtrl.perfilAdmins = async (req, res) => {
  console.log(req.userId);
  let sql = `SELECT * FROM admins WHERE email = $1`;
  dbConnection.query(sql, [req.userId], async (err, row) => {
    if (err) {
      logger.info(err);
      logger.info(
        `Usuario inexistente, Se paso un token con formato invalido, o no esta asignado a un usuario`
      );
      return res.status(404).send("El Usuario no fue encontrado");
    } else {
      // Si existe
      logger.info("Se permite ingresar al perfil del usuario");
      console.log("whoamy");
      console.log(row.rows);
      res.status(200).json(row.rows);
    }
  });
};

module.exports = usuariosCtrl;
