//Server
const express = require("express");
const logger = require("./src/util/logger");
const cors = require("cors");

app = express();
const morgan = require("morgan");

// Settings
app.set("port", process.env.PORT|| 3001);
//Middleware
app.use(cors());
app.use(express.json());
app.use(
  morgan("short", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

//Routes
app.use("/usuarios", require("./src/resources/usuarios/usuarios.routes"));
app.use("/admins", require("./src/resources/admins/admins.routes")); 
app.use("/product", require("./src/resources/product/product.routes"));

module.exports = app;
