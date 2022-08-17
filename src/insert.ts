import { db } from "./lib/database";
import { randomUUID } from "node:crypto";
import { Users } from "./model/users";
import { Rules } from "./model/rules";


async function main() {
    const user = await Users.create(
        "User", "user@email.com", "user", "#Trocar123",
    );
    await db.routes.create({
        data: {
            entry_http_method: "get",
            id: randomUUID(),
            metadata: {},
            entrypoint: "/proxy/testing",
            out_http_method: "get",
            target_path: "/api/get",
            target_host: "http://localhost:3000",
            created_at: new Date(),
            deleted_at: null,
            updated_at: new Date(),
        },
    });
    const rootClaimsId = randomUUID();
    await db.claims.create({
        data: {
            id: rootClaimsId,
            created_at: new Date(),
            updated_at: new Date(),
            name: "root",
        },
    });
    await db.user_claims.create({
        data: {
            id: randomUUID(),
            created_at: new Date(),
            status: "active",
            assigned_by: "user@email.com",
            usersId: user.id,
            claimsId: rootClaimsId,
        },
    });
    await db.rules.create({
        data: {
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
            httpMethod: "get",
            claim: "^root$",
            route: "/proxy/testing",
            metadata: {
                urlParams: {
                    type: Rules.UrlParamsType.Uuid,
                    operator: Rules.Operators.Is,
                    from: ({
                        operator: Rules.Value.JWT,
                        key: "uid",
                    }),
                    to: ({
                        operator: Rules.Value.URL,
                        key: "id",
                    }),
                },
            },
        },
    });
}

main();
