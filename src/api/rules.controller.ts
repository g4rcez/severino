import { Http } from "../lib/http";
import { Rules } from "../model/rules";

export namespace RulesController {
    export const getAll = Http.endpoint(async (_, res) => {
        const items = await Rules.getRules();
        return res.json({ items });
    });
}
