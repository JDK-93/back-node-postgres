const helpers = {};

helpers.queryStringSelect = (req) => {
  const { rfid, userid } = req.query;
  let i = 0;
  let params = [];
  let sql = `SELECT * FROM product WHERE`;

  if (rfid) {
    i += 1;
    params.push(rfid);
    sql = sql + ` rfid = $${i} AND`;
  }
  if (userid) {
    i += 1;
    params.push(userid);
    sql = sql + ` userid = $${i} AND`;
  }
  if (i === 0) {
    sql = sql.slice(0, -6);
  } else {
    sql = sql.slice(0, -3);
  }

  //sql = sql.slice(0, -3)
  console.log(sql);
  console.log(params);

  return { sql, params };
};

// Función para generar la petición para crear un usuario.
helpers.queryStringCreate = async (req) => {
  let errors = [];
  console.log(req.body);

  if (!req.body.date) {
    errors.push("Se requiere fecha");
  }

  if (!req.body.usuario) {
    errors.push("Se requiere usuario");
  }

  if (!req.body.ubicacion) {
    errors.push("Se requiere ubicacion");
  }
  if (!req.body.temperatura) {
    errors.push("Se requiere temperatura");
  }

  if (errors.length) {
    return { errors };
  }

  let params = [
    req.body.date,
    req.body.usuario,
    req.body.ubicacion,
    req.body.temperatura,
  ];
  let sql =
    "INSERT INTO product (date, usuario, ubicacion, temperatura) VALUES (?,?,?,?)";

  return { sql, params, errors };
};

module.exports = helpers;
