import { Jwt } from "../api/jwt.controller";
import { Http } from "../lib/http";
import { Strings } from "../lib/strings";
import { Rules } from "../model/rules";
import { Metadata } from "../lib/metadata";

export namespace DynamicRouter {
    export const middleware = Http.endpoint(async (req, res, next) => {
        const rules = await Rules.getRules(req.method.toLowerCase());
        const normalizeUrl = Strings.normalizePath(req.url);
        const rule = rules.find((rule) => {
            if (rule.route === normalizeUrl) return true;
            const matchRule = Strings.matchUrl(rule.route);
            return !!matchRule(normalizeUrl);
        });

        if (rule === undefined) return next();

        if (rule.httpMethod !== req.method.toLowerCase()) return res.status(Http.NOT_FOUND).json({ url: normalizeUrl });

        const matchClaims = new RegExp(rule.claim);
        const user: Jwt.PublicPayload = res.locals.user;
        const hasAllowedClaims = user.roles.some((x) => matchClaims.test(x));
        if (!hasAllowedClaims) {
            return res.status(Http.NOT_AUTHORIZED).json({
                url: normalizeUrl,
                message: "Claims not allowed",
            });
        }

        const result = Metadata.valid(rule.metadata, user, rule, req);
        return result ? next() : res.status(Http.NOT_AUTHORIZED).json({ url: normalizeUrl, message: "Not authorized" });
    });
}
