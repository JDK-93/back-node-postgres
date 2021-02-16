require("dotenv").config(); //cargo variables de entorno

const app = require("./app");

require("./database");

async function main() {
  await app.listen(app.get("port"));
  console.log(`Server in Port ${app.get("port")}`);
}

main();
