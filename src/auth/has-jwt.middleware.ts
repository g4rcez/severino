import { Jwt } from "../api/jwt.controller";
import { Http } from "../lib/http";

export const hasJwt = Http.endpoint(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (typeof authorization !== "string")
        return res.status(Http.NOT_AUTHORIZED).json({ message: "No authorization token" });
    const { valid, payload } = await Jwt.validate(authorization);
    if (!valid) return res.status(Http.NOT_AUTHORIZED).json({ message: "Invalid authorization token" });
    res.locals.user = payload;
    return next();
});
