const logger = require("../../util/logger");

const dbConnection = require("../../../database");
const { queryStringSelect } = require("./product.helper");

const productCtrl = {};

// GET obtener product, se pueden pedir todas, o solamente
// las que cumplan con los filtros pasados por req.
productCtrl.getProduct = (req, res) => {
  let response = queryStringSelect(req);
  dbConnection.query(response.sql, response.params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      throw err;
    } else {
      logger.info(`Devolvidas las mediciones`);
      res.status(200).json(row.rows);
    }
  });
};

// POST crear Medición (ruta accesible unicamente por los sensores)
productCtrl.createProduct = async (req, res) => {
  // let med = [req.body.date, req.body.usuario, req.body.ubicacion, req.body.temperatura]
  const {
    date,
    userid,
    termometroid,
    temp,
    tempambiente,
    distancia,
  } = req.body;
  console.log(req.body);
  dbConnection.query(
    "INSERT INTO product (date, userid, termometroid, temp, tempambiente, distancia) VALUES ($1,$2,$3,$4,$5,$6)",
    [date, userid, termometroid, temp, tempambiente, distancia],
    function (err) {
      if (err) {
        // Si la petición me devuelve un error, es un error interno, pero el error interno puede ser de email duplicado
        logger.error(err);
        res.status(500).send(`Error interno en el Servidor`);
      } else {
        logger.info(`Medición creado exitosamente para el email ]`);
        res.status(200).send("Medición cargada correctamente");
      }
    }
  );
};

module.exports = productCtrl;
