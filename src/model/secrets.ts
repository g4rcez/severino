import { createHmac, randomUUID } from "node:crypto";
import { db } from "../lib/database";

export namespace Secrets {
    const secrets = db.secrets;

    export type Item = NonNullable<Awaited<ReturnType<typeof lastSecret>>>;

    export const lastSecret = async () => {
        const lastSecret = await secrets.findFirst({
            orderBy: [{ expires_in: "asc" }, { created_at: "desc" }],
            take: 1,
        });
        return lastSecret;
    };

    export enum Type {
        OneTimeToken = "OneTimeToken",
        AccessToken = "AccessToken",
    }

    export const create = async (version: string, expiresIn: Date) => {
        const hash = createHmac("sha512", version);
        const token = hash.digest("hex").toString();
        const secret = await secrets.create({
            data: {
                token: token,
                revoked: false,
                id: randomUUID(),
                expires_in: expiresIn,
                created_at: new Date(),
                type: Type.AccessToken,
            },
        });
        return secret;
    };
}
