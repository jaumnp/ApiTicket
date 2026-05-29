import http from "node:http";
import { bodyMiddleware } from "./middlewares/bodyMiddleware.js";
import { routesMiddleware } from "./middlewares/routesMiddleware.js";
import { createDatabase } from "./database/db.js";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const db = createDatabase("db.json");

    await bodyMiddleware({ req, res });
    await routesMiddleware({ req, res, db });
});

server.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});