const helpers = {};

// POST users
helpers.newUsers = async (req) => {
  const {
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
  let values = [rfid, dni, name, telefono, email, sexo, date, grupo, admin];
  let text = `INSERT INTO users (rfid, dni, name, telefono, email, sexo, date, grupo, adminid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  return { text, values };
};

// GET users
helpers.getUsers = (req) => {
  //const { rfid, dni, name, email, admin } = req.body;
  const { rfid, dni, name, adminid } = req.query;
  let banderaRfid = 0;
  let i = 0;
  let values = [];
  let text = "SELECT * FROM users WHERE";

  if (rfid) {
    banderaRfid = 1;
    i += 1;
    values.push(rfid);
    text = text + ` rfid = $${i} AND`; //
  }

  if (dni) {
    i += 1;
    values.push(dni);
    text = text + ` dni = $${i} AND`;
  }

  if (name) {
    i += 1;
    values.push(name);
    text = text + ` name = $${i} AND`;
  }

  if (adminid) {
    i += 1;
    values.push(adminid);
    text = text + ` adminid = $${i} AND`;
  }

  if (i === 0) {
    text = text.slice(0, -6);
  } else {
    text = text.slice(0, -3);
  }

  console.log(text);
  console.log(values);
  text = text + ` ORDER BY userid`;
  console.log(text);
  if (banderaRfid === 1) {
    return { text, values, rfid };
  } else {
    return { text, values };
  }
};

// DELETE usuarios por RFID, DNI o email (uno de los tres)
helpers.deleteUsers = (req) => {
  const { userid, rfid, dni, email } = req.query;
  let i = 0;
  let values = [];
  let text = "DELETE FROM users WHERE";

  if (rfid && i === 0) {
    i += 1;
    values.push(rfid);
    text = text + ` rfid = $${i}`;
  }

  if (userid && i === 0) {
    i += 1;
    values.push(userid);
    text = text + ` userid = $${i}`;
  }

  if (dni && i === 0) {
    i += 1;
    values.push(dni);
    text = text + ` dni = $${i}`;
  }

  if (email && i === 0) {
    i += 1;
    values.push(email);
    text = text + ` email = $${i}`;
  }
  console.log(text);
  console.log(values);
  return { text, values };
};

module.exports = helpers;
