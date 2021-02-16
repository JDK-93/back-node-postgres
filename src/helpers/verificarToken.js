const jwt = require("jsonwebtoken");
const logger = require("../util/logger");

let verificatToken = async (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      //si no tiene token
      logger.info("El usuario no ha proporcionado un token");
      return res
        .status(401)
        .send({ Autorizacion: false, message: "No se ha pasado un token" });
    }
    //console.log(token)
    // Si me da un token, decodifico
    let decoded = await jwt.verify(
      token,
      process.env.SECRETJWT || "Estos_es*unSECreto"
    );

    req.userId = decoded.id; //guardo el id en la req para poder usarlo entre rutas

    next();
  } catch (err) {
    res.status(500).send(`Error de Token, Token Invalido`);
    logger.error("Token Invalido");
  }
};

module.exports = verificatToken;
