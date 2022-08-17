import { Http } from "../lib/http";
import { Routes } from "../model/routes";
import { createProxy } from "http-proxy";
import { stringify } from "query-string";
import { Is } from "../lib/is";
import { compile, PathFunction } from "path-to-regexp";
import { Strings } from "../lib/strings";
import { Nullable } from "../lib/utility.types";

export namespace ProxyRouter {
    export const proxy = createProxy({ xfwd: true, changeOrigin: true, followRedirects: true });

    const formatWithQueryString = (url: string, qs: object): string =>
        Is.empty(qs) ? url : `${url}?${stringify(qs)}`;

    export const compileRegex = (path: string) => compile(path, { encode: encodeURIComponent });

    type Dict = Record<string, any>

    export const transformUrlPath = (
        url: string,
        origin: string,
        queryString: Dict,
        params: Dict,
        regexCompiler: PathFunction,
    ) => formatWithQueryString(origin.includes("*") ? url : regexCompiler(params), queryString);


    export const middleware = Http.endpoint(async (req, res) => {
        const method = req.method.toLowerCase();
        const routes = await Routes.getAll(method);
        const url = Strings.normalizePath(req.originalUrl);
        const match = routes.reduce<{ params: object; route: Nullable<Routes.Shape> }>((acc, route) => {
            if (acc.route !== null) {
                return acc;
            }
            const result = Strings.matchUrl(route.entrypoint)(url);
            return result ? { params: result.params, route } : acc;
        }, { params: {}, route: null });

        if (match.route === null) {
            return res.status(Http.NOT_FOUND).json({ url, message: "Not found" });
        }

        if (method !== match.route.entryHttpMethod) {
            return res.status(Http.METHOD_NOT_ALLOWED).json({ url, message: "Method not allowed" });
        }

        req.method = match.route.outHttpMethod;
        req.url = transformUrlPath(url, match.route.entryHttpMethod, req.query, match.params, compileRegex(match.route.targetPath));

        const proxyHandler = Routes.isWebSocket(match.route) ? proxy.ws : proxy.web;
        return proxyHandler(req, res, { target: match.route.hostname, changeOrigin: true });
    });
}
