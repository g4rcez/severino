import { match } from "path-to-regexp";
import { Jwt } from "../api/jwt.controller";
import { Http } from "../lib/http";
import { Strings } from "../lib/strings";
import { Rules } from "../model/rules";

export namespace DynamicRouter {
    export const middleware = Http.endpoint(async (req, res, next) => {
        const rules = await Rules.getRules();
        const normalizeUrl = Strings.normalizePath(req.url);
        const allowedRule = rules.find((rule) => {
            if (rule.route === normalizeUrl) return true;
            const matchRule = match(rule.route, { decode: decodeURIComponent, sensitive: true, strict: false });
            return !!matchRule(normalizeUrl);
        });
        if (allowedRule === undefined) return res.status(Http.NOT_FOUND).json({ url: normalizeUrl });
        const matchClaims = new RegExp(allowedRule.claim);
        const user: Jwt.PublicPayload = res.locals.user;
        const hasAllowedClaims = user.roles.some((x) => matchClaims.test(x));
        if (hasAllowedClaims) return next();
        return res.status(Http.NOT_AUTHORIZED).json({ url: normalizeUrl, message: "Claims not allowed" });
    });
}
