import memoizee from "memoizee";
import { db } from "../lib/database";
import { Metadata } from "../lib/metadata";

export namespace Rules {
    const rules = db.rules;

    export const enum Status {
        Active = "active",
        Disabled = "disabled",
    }

    export type Shape = {
        id: string
        claim: string;
        status: Status;
        httpMethod: Lowercase<string>;
        metadata: Metadata.Shape
        route: string;
    }

    export const getRules = memoizee(
        (httpMethod?: string): Promise<Shape[]> => {
            const select = { id: true, claim: true, route: true, status: true, httpMethod: true, metadata: true };
            if (httpMethod === undefined) return rules.findMany({ select, where: { status: Status.Active } }) as never;
            return rules.findMany({ select, where: { status: Status.Active, AND: { httpMethod } } }) as never;
        },
        { async: true, length: 0, resolvers: [], maxAge: 10000 },
    );

}
