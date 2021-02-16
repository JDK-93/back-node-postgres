const bcrypt = require("bcryptjs");
const helpers = {};

// Cifrar contraseña
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Función para generar la petición de usuarios con los filtros solicitados.
helpers.queryStringSelect = (filters) => {
  const { name, email, password } = filters;
  let i = 0;
  let params = [];
  let sql = `SELECT * FROM admins WHERE`;

  if (name) {
    i += 1;
    params.push(name);
    sql = sql + ` name =  $${i} AND`;
  }

  if (email) {
    i += 1;
    params.push(years_later);
    sql = sql + ` email = $${i} AND`;
  }

  if (password) {
    i += 1;
    params.push(years_before);
    sql = sql + ` password = $${i} AND`;
  }

  sql = sql.slice(0, -3);
  console.log(sql);
  return { sql, params };
};

// Función para generar la petición para actualizar un usuario determinado.
helpers.queryStringUpdate = (req) => {
  let params = [];
  let sql = `UPDATE admins SET `;
  if (req.body.name) {
    params.push(req.body.name);
    sql = sql + ` name = ?,`;
  }

  if (req.body.lastName) {
    params.push(req.body.lastName);
    sql = sql + ` email = ?,`;
  }

  if (req.body.birthday) {
    params.push(req.body.birthday);
    sql = sql + ` password = ?,`;
  }

  if (req.body.dni) {
    params.push(req.body.dni);
    sql = sql + ` dni = ?,`;
  }

  if (!params.length) {
    res
      .status(400)
      .json({ error: "Se requiere al menos un valor para actualizar." });
    return;
  }

  sql = sql.slice(0, -1);
  sql = sql + " WHERE id = ? ";
  params.push(req.params.id);
  return { sql, params };
};

// Función para generar la petición para crear un usuario.
helpers.queryStringCreate = async (req) => {
  let passwordEncript = await encryptPassword(req.body.password);

  let errors = [];

  if (!req.body.name) {
    errors.push("Se requiere nombre");
  }

  if (!req.body.email) {
    errors.push("Se requiere email");
  }

  if (!passwordEncript) {
    errors.push("Se requiere password");
  }

  if (errors.length) {
    return { errors };
  }

  let params = [req.body.name, req.body.email, passwordEncript];
  let sql = "INSERT INTO admins (name, email, password) VALUES (?,?,?)";

  return { sql, params, errors };
};

module.exports = helpers;
