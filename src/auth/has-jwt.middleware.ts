import { Jwt } from "../api/jwt.controller";
import { Http } from "../lib/http";
import { Either } from "../lib/either";

export const hasJwt = Http.endpoint(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (typeof authorization !== "string")
        return res.status(Http.NOT_AUTHORIZED).json({ message: "No authorization token" });
    const validation = await Jwt.validate(authorization);
    if (Either.isLeft(validation)) return res.status(Http.NOT_AUTHORIZED).json({ message: "Invalid authorization token" });
    res.locals.user = validation.right;
    return next();
});
