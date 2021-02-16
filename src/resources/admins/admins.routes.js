const { Router } = require("express");
const router = Router();

const { validarUsuarios, validarPedidoDeLogin } = require("./admins.validate");
const verificarToken = require("../../helpers/verificarToken");
const {
  getAdmins,
  createAdmins,
  loginAdmins,
  perfilAdmins,
} = require("./admins.controller");

router.route("/").get(getAdmins);

router
  .route("/signup") // Deshabilitar esta ruta, los admins no se crean, existen
  .post(validarUsuarios, createAdmins);

router.route("/login").post(validarPedidoDeLogin, loginAdmins);

router
  .route("/whoami") //probado | queda ver si es necesario buscar usuarios/
  .get(verificarToken, perfilAdmins);

module.exports = router;
