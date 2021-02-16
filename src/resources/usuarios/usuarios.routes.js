const { Router } = require("express");

const router = Router();

const { validarUsuarios } = require("./usuarios.validate");
const {
  getUsuarios,
  createUsuarios,
  deleteUsuario,
  updateUsuario,
} = require("./usuarios.controller");

router.route("/").get(getUsuarios);
router.route("/signup").post(validarUsuarios, createUsuarios);
router.route("/update").put(updateUsuario);
router.route("/delete").delete(deleteUsuario);

module.exports = router;
