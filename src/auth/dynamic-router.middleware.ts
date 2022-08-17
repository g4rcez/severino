import { Jwt } from "../api/jwt.controller";
import { Http } from "../lib/http";
import { Strings } from "../lib/strings";
import { Rules } from "../model/rules";
import { Request } from "express";
import { Either } from "../lib/either";

export namespace DynamicRouter {

    const findRule = async (req: Request, url: string) => {
        const rules = await Rules.getRules(req.method.toLowerCase());
        const rule = rules.find((rule) => {
            if (rule.route === url) return true;
            const matchRule = Strings.matchUrl(rule.route);
            return !!matchRule(url);
        });
        return rule === undefined ? Either.left(null) : Either.right(rule);
    };

    export const middleware = Http.endpoint(async (req, res, next) => {
        const url = Strings.normalizePath(req.url);
        const eitherRule = await findRule(req, url);
        if (Either.isLeft(eitherRule)) return next();

        const rule = eitherRule.right;

        if (rule.httpMethod !== req.method.toLowerCase()) {
            return res.status(Http.NOT_FOUND).json({ url });
        }

        const matchClaims = new RegExp(rule.claim);
        const user: Jwt.PublicPayload = res.locals.user;
        const hasAllowedClaims = user.roles.some((x) => matchClaims.test(x));
        if (!hasAllowedClaims) {
            return res.status(Http.NOT_AUTHORIZED).json({ url, message: "Claims not allowed" });
        }

        const validation = Rules.valid(rule.metadata, user, rule, req);
        if (Either.isLeft(validation)) {
            return res.status(Http.NOT_AUTHORIZED).json({
                url: url,
                errors: validation.left,
                message: "Not authorized",
            });
        }
        return next();
    });
}
