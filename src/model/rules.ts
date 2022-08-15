import memoizee from "memoizee";
import { db } from "../lib/database";

export namespace Rules {
    const rules = db.rules;

    const enum Status {
        Active = "active",
        Disabled = "disabled",
    }

    export const getRules = memoizee(
        () =>
            rules.findMany({
                where: { status: Status.Active },
                select: { id: true, claim: true, route: true, status: true },
            }),
        { async: true, length: 0, resolvers: [], maxAge: 10000 },
    );
}
