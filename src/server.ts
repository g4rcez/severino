import express, { json, Router } from "express";
import { RulesController } from "./api/rules.controller";
import { UserController } from "./api/user.controller";
import { DynamicRouter } from "./auth/dynamic-router.middleware";
import { hasJwt } from "./auth/has-jwt.middleware";
import { Env } from "./env";

export namespace Server {
    export const createRouter = (): Router => {
        const router = Router({ caseSensitive: true }).use(json());
        router.post("/user/new", UserController.New);
        router.post("/user/login", UserController.Login);

        router.use(hasJwt, DynamicRouter.middleware);
        router.get("/user/:id", UserController.GetById);
        router.get("/rules", RulesController.GetAll);
        router.get("/test", (_, res) => res.json({ success: true }));
        return router;
    };

    export const init = async () => {
        const routes = createRouter();
        const app = express().disable("x-powered-by").disable("etag").use(routes);
        return app.listen(Env.PORT, () => console.log(`starts in :${Env.PORT}`));
    };
}
