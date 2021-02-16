const Joi = require("joi");
const logger = require("../../util/logger");

const blueprintUsuario = Joi.object().keys({
  name: Joi.string().max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  admin: Joi.string().required(),
});

let validarUsuarios = (req, res, next) => {
  const resultado = Joi.validate(req.body, blueprintUsuario, {
    abortEarly: false,
    convert: false,
  });

  if (resultado.error === null) {
    next();
  } else {
    let erroresDeValidacion = resultado.error.details.reduce(
      (acumulador, error) => {
        return acumulador + `[${error.message}]`;
      },
      ""
    );
    console.log(erroresDeValidacion);
    logger.info(
      "Usuario no puedo ser validado",
      resultado.error.details.map((error) => error.message)
    );
    res
      .status(400)
      .send(
        `Tu usuario no cumple requisitos. Contraseña debe ser una frase con espacios [${erroresDeValidacion}]`
      );
  }
};

const blueprintPedidoDeLogin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

let validarPedidoDeLogin = (req, res, next) => {
  const resultado = Joi.validate(req.body, blueprintPedidoDeLogin, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === null) {
    next();
  } else {
    res
      .status(400)
      .send("Login fallo. Debes especificar email y contraseña de usuario.");
  }
};

module.exports = {
  validarPedidoDeLogin,
  validarUsuarios,
};
