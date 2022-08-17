import memoizee from "memoizee";
import { db } from "../lib/database";
import { z } from "zod";
import { Request } from "express";
import { Either } from "../lib/either";
import { Jwt } from "../api/jwt.controller";
import { Is } from "../lib/is";
import { Strings } from "../lib/strings";


export namespace Rules {
    const rules = db.rules;

    export const enum Status {
        Active = "active",
        Disabled = "disabled",
    }

    export enum Operators {
        Includes = "includes",
        Is = "is"
    }

    export enum Value {
        URL = "url",
        JWT = "jwt"
    }

    export enum UrlParamsType {
        Uuid = "uuid",
    }

    const regex = {
        uuid: /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/,
    };

    const urlParamsTypeValidator = {
        [UrlParamsType.Uuid]: (str: string) => regex.uuid.test(str),
    };

    export const schema = z.object({
        urlParams: z.object({
            type: z.nativeEnum(UrlParamsType).optional(),
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

    export type Metadata = z.infer<typeof schema>;

    export type Shape = {
        id: string
        claim: string;
        status: Status;
        httpMethod: Lowercase<string>;
        metadata: Metadata;
        route: string;
    }


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

    export const valid = (input: Metadata, payload: Jwt.PublicPayload, rule: Rules.Shape, req: Request) => {
        if (Is.empty(input)) Either.right(true);
        const validation = schema.safeParse(input);
        if (!validation.success) {
            return Either.left(validation.error.issues.map(x => x.message));
        }
        const metadata = validation.data;
        const customValidations: string[] = [];
        if (metadata.urlParams) {
            const matcher = Strings.matchUrl(rule.route);
            const matcherResult = matcher(req.url);
            const urlParams: Params = matcherResult ? matcherResult.params as never : {};
            const to = valueFromRequest[metadata.urlParams.to.operator](metadata.urlParams.to.key, req, payload, urlParams);
            const from = valueFromRequest[metadata.urlParams.from.operator](metadata.urlParams.from.key, req, payload, urlParams);

            if (metadata.urlParams.type) {
                const fn = urlParamsTypeValidator[metadata.urlParams.type];
                if (to && !fn(to.toString())) customValidations.push(`'${to}' is not a '${metadata.urlParams.type}'`);
                if (from && !fn(from.toString())) customValidations.push(`'${from}' is not a '${metadata.urlParams.type}'`);
            }
            const success = comparator[metadata.urlParams.operator](to, from);
            if (!success) {
                customValidations.push(`Wrong operator '${metadata.urlParams.operator}' for values '${to}' and '${from}'`);
            }
        }
        return customValidations.length === 0 ? Either.right([]) : Either.left(customValidations);
    };

    export const getRules = memoizee(
        (httpMethod?: string): Promise<Shape[]> => {
            const select = { id: true, claim: true, route: true, status: true, httpMethod: true, metadata: true };
            if (httpMethod === undefined) return rules.findMany({ select, where: { status: Status.Active } }) as never;
            return rules.findMany({ select, where: { status: Status.Active, AND: { httpMethod } } }) as never;
        },
        { async: true, length: 0, resolvers: [], maxAge: 10000 },
    );


}
