import { Jwt } from "../api/jwt.controller";
import { Http } from "../lib/http";
import { Strings } from "../lib/strings";
import { Rules } from "../model/rules";
import { Request } from "express";
import { Either } from "../lib/either";

export namespace DynamicRouter {

    const findRules = async (req: Request, url: string) => {
        const rules = await Rules.getRules(req.method.toLowerCase());
        return rules.filter((rule) => {
            if (rule.route === url) return true;
            const matchRule = Strings.matchUrl(rule.route);
            return !!matchRule(url);
        });
    };

    const validateRule = (rule: Rules.Shape, url: string, req: Request, user: Jwt.PublicPayload) => {
        if (rule.httpMethod !== req.method.toLowerCase()) {
            return ({ status: Http.NOT_FOUND, data: { url } });
        }
        const matchClaims = new RegExp(rule.claim);
        const hasAllowedClaims = user.roles.some((x) => matchClaims.test(x));
        if (!hasAllowedClaims) {
            return ({ status: Http.NOT_AUTHORIZED, data: { url, message: "Claims not allowed" } });
        }
        const validation = Rules.valid(rule.metadata, user, rule, req);
        if (Either.isRight(validation)) {
            return null;
        }
        return ({
            status: Http.NOT_AUTHORIZED, data: { url, errors: validation.left, message: "Not Authorized" },
        });
    };

    export const middleware = Http.endpoint(async (req, res, next) => {
        const url = Strings.normalizePath(req.url);
        const rules = await findRules(req, url);
        if (rules.length === 0) {
            return next();
        }
        for (const i in rules) {
            const rule = rules[i];
            if (rule) {
                const result = validateRule(rule, url, req, res.locals.user);
                if (result !== null) {
                    return res.status(result.status).json(result.data);
                }
            }
        }
        return next();
    });
}
