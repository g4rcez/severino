import express, { json, Router } from "express";
import { RulesController } from "./api/rules.controller";
import { UserController } from "./api/user.controller";
import { DynamicRouter } from "./auth/dynamic-router.middleware";
import { hasJwt } from "./auth/has-jwt.middleware";
import { Env } from "./env";
import { ProxyRouter } from "./api/proxy-router.middleware";

export namespace Server {
    export const createRouter = (): Router => {
        const jsonMiddleware = json();
        const router = Router({ caseSensitive: true });
        router.post("/user/new", jsonMiddleware, UserController.create);
        router.post("/user/login", jsonMiddleware, UserController.login);
        router.use(hasJwt, DynamicRouter.middleware);
        router.get("/user/:id", UserController.getById);
        router.get("/rules", RulesController.getAll);
        router.get("/proxy/testing/:id", (req, res) => res.json({
            url: req.url,
            success: true,
            params: req.params,
            headers: req.headers,
        }));
        router.use("/api", ProxyRouter.middleware);
        return router;
    };

    export const init = async () => {
        const routes = createRouter();
        const app = express().disable("x-powered-by").disable("etag").use(routes);
        return app.listen(Env.PORT, () => console.log(`starts in :${Env.PORT}`));
    };
}
