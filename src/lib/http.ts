import { NextFunction, Request, Response } from "express";

export namespace Http {
    export const OK = 200;
    export const NOT_FOUND = 404;
    export const BAD_REQUEST = 400;
    export const NOT_AUTHORIZED = 401;
    export const METHOD_NOT_ALLOWED = 405;
    export const INTERNAL_SERVER_ERROR = 500;

    type Endpoint = (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => Promise<Response | void> | Response | Promise<void>;

    export const endpoint = (callback: Endpoint) => (req: Request, res: Response, next: NextFunction) =>
        callback(req, res, next);
}
