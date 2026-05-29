import { routes } from "../routes.js";

function extractParams({ req, route }) {
    const match = req.url.match(route.path);
    return match?.groups ? { ...match.groups } : {};
}

async function routesMiddleware({ req, res, db }) {
    const route = routes.find(
        (r) => req.method === r.method && r.path.test(req.url)
    );

    if (!route) {
        return res.writeHead(404).end(JSON.stringify({ message: "Rota não encontrada!" }));
    }

    req.params = extractParams({ req, route });

    try {
        await route.controller({ req, res, db });
    } catch (error) {
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Erro interno no servidor, tente mais tarde!" }));
        }
    }
}

export { routesMiddleware };