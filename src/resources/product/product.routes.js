const { Router } = require("express");
const router = Router();
const { getProduct, createProduct } = require("./product.controller");

router.route("/").get(getProduct);
router.route("/").post(createProduct);

module.exports = router;
