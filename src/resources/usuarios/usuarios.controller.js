var moment = require("moment"); // require
const logger = require("../../util/logger");
const dbConnection = require("../../../database");
const { newUsers, getUsers, deleteUsers } = require("./usuario.helpers");

const usuariosCtrl = {};

// GET usuarios (admite filtros)
usuariosCtrl.getUsuarios = async (req, res) => {
  // Me interesa filtrar por administrador que lo cargó, por nombre y por rfid
  //console.log(req)
  let sql = await getUsers(req);
  dbConnection.query(sql.text, sql.values, (err, resql) => {
    if (err) {
      logger.error(err);
      res.status(400).json({ error: err.detail });
    } else {
      if (resql.rowCount > 0) {
        if (sql.rfid) {
          logger.info(`Se busco por RFID encontrados ${sql.rfid}`);
          resql.rows[0].edad = Math.floor(
            moment(new Date()).diff(
              moment(resql.rows[0].date, "YYYY-MM-DD"),
              "years",
              true
            )
          ); //2020-10-14
          console.log(resql.rows[0].date);
          res.status(200).json(resql.rows[0]);
        } else {
          logger.info(`GET de todos los usuarios`);
          res.status(200).json(resql.rows);
        }
      } else {
        logger.info(`RFID no encontrado`);
        res.status(204).json({});
      }
    }
  });
};

// POST Crear usuario
usuariosCtrl.createUsuarios = async (req, res) => {
  let sql = await newUsers(req);
  console.log(sql);
  dbConnection.query(sql.text, sql.values, (err, resql) => {
    if (err) {
      logger.error(err);
      res.status(400).json({ error: err.detail });
    } else {
      logger.info(`Usuario con id: ${req.body.rfid}, añadido correctamente.`);
      res
        .status(200)
        .json({ message: `Usuario ${req.body.name} añadido correctamente.` });
    }
  });
};

// DELETE usuarios por RFID, DNI o email
usuariosCtrl.deleteUsuario = async (req, res) => {
  let sql = deleteUsers(req);
  dbConnection.query(sql.text, sql.values, (err, resql) => {
    if (err) {
      logger.info(`Usuario inexistente.`);
      return res.status(404).send("El Usuario no fue encontrado");
    } else {
      if (resql.rowCount > 0) {
        // Se encontró y se eliminó
        logger.info(`Usuario ${sql.values} eliminado correctamente.`);
        res.status(200).send(`Usuario ${sql.values} eliminado correctamente.`);
      } else {
        // No se encontró para eliminar
        logger.info(`El Usuario ${sql.values} no existe.`);
        res.status(400).send(`El Usuario ${sql.values} no existe.`);
      }
    }
  });
};

// UPDATE usuario
// Para editar, tengo que enviar todos los parámetros.
usuariosCtrl.updateUsuario = async (req, res) => {
  const {
    userid,
    rfid,
    dni,
    name,
    telefono,
    email,
    sexo,
    date,
    grupo,
    admin,
  } = req.body;
  dbConnection.query(
    `UPDATE users SET rfid = $1, dni =$2, name=$3, telefono=$4, email=$5, sexo=$6, date=$7, grupo=$8, adminId=$9 WHERE userid =$10`,
    [rfid, dni, name, telefono, email, sexo, date, grupo, admin, userid],
    function (err, rows) {
      if (err) {
        logger.info(err);
        logger.info(
          `Usuario inexistente, Se paso un token con formato invalido, o no esta asignado a un usuario`
        );
        return res.status(404).send("El Usuario no fue encontrado");
      } else {
        console.log(rows.rowCount);
        console.log(`Row(s) updated: ${rows.rowCount}`);
        if (rows.rowCount > 0) {
          // Se encontró y se actualizó
          console.log(rows.rowCount);
          logger.info(`Usuario con dni ${dni} actualizado correctamente.`);
          res
            .status(200)
            .send(`Usuario con dni ${dni} actualizado correctamente.`);
        } else {
          // No se encontró para actualizar
          logger.info(`El Usuario con rfid ${rfid} no existe.`);
          res.status(400).send(`El Usuario con rfid ${rfid} no existe.`);
        }
      }
    }
  );
};

module.exports = usuariosCtrl;
