import { match } from "path-to-regexp";


export namespace Strings {
    // https://github.com/pillarjs/path-to-regexp#alternative-using-normalize
    export const normalizePath = (pathname: string) =>
        decodeURI(pathname)
            .trim()
            // Replaces repeated slashes in the URL.
            .replace(/\/+/g, "/")
            // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
            // Note: Missing native IE support, may want to skip this step.
            .normalize();

    export const matchUrl = (route: string) => match(route, {
        decode: decodeURIComponent,
        sensitive: true,
        strict: false,
    });
}
