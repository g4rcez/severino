import { Http } from "../lib/http";
import { Rules } from "../model/rules";

export namespace RulesController {
    export const GetAll = Http.endpoint(async (_, res) => {
        const items = await Rules.getRules();
        return res.json({ items });
    });
}
