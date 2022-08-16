import { z } from "zod";
import { Request } from "express";
import { Either } from "./either";
import { Jwt } from "../api/jwt.controller";
import { Is } from "./is";
import { Rules } from "../model/rules";
import { Strings } from "./strings";

export namespace Metadata {
    export enum Operators {
        Includes = "includes",
        Is = "is"
    }

    export enum Value {
        URL = "url",
        JWT = "jwt"
    }

    export const schema = z.object({
        urlParams: z.object({
            operator: z.nativeEnum(Operators),
            from: z.object({
                operator: z.nativeEnum(Value),
                key: z.string(),
            }),
            to: z.object({
                operator: z.nativeEnum(Value),
                key: z.string(),
            }),
        }),
    }).partial();

    export type Shape = z.infer<typeof schema>;

    const comparator = {
        [Operators.Includes]: (a: any, b: any) => {
            if (typeof a === "string" && typeof b === "string") {
                return a.includes(b);
            }
            return false;
        },
        [Operators.Is]: (a: any, b: any) => a === b,
    };

    type Params = Record<string, string>

    const valueFromRequest = {
        [Value.JWT]: (key: string, _: Request, jwt: Jwt.PublicPayload, __: Params) => jwt[key as keyof Jwt.PublicPayload],
        [Value.URL]: (key: string, _: Request, __: Jwt.PublicPayload, params: Params) => params[key],
    };

    export const valid = (input: Shape, payload: Jwt.PublicPayload, rule: Rules.Shape, req: Request) => {
        if (Is.empty(input)) return true;
        const validation = schema.safeParse(input);
        if (!validation.success) return Either.left(validation.error.issues);
        const metadata = validation.data;
        const customValidations: boolean[] = [];
        if (metadata.urlParams) {
            const matcher = Strings.matchUrl(rule.route);
            const matcherResult = matcher(req.url);
            const urlParams: Params = matcherResult ? matcherResult.params as never : {};
            const to = valueFromRequest[metadata.urlParams.to.operator](metadata.urlParams.to.key, req, payload, urlParams);
            const from = valueFromRequest[metadata.urlParams.from.operator](metadata.urlParams.from.key, req, payload, urlParams);
            const result = comparator[metadata.urlParams.operator](to, from);
            customValidations.push(result);
        }
        return customValidations.every(Boolean);
    };
}