import { db } from "../lib/database";
import { z } from "zod";
import memoizee from "memoizee";

export namespace Routes {
    const routes = db.routes;

    const metadataSchema = z.object({}).partial();

    type Metadata = z.infer<typeof metadataSchema>

    export type Shape = {
        protocol: string;
        hostname: string
        targetPath: string,
        entrypoint: string,
        metadata: Metadata,
        outHttpMethod: string,
        entryHttpMethod: string
    }


    export const getAll = memoizee(async (method: Lowercase<string>) => {
        const items = await routes.findMany({
            orderBy: { updated_at: "asc" },
            where: {
                deleted_at: null, AND: {
                    entry_http_method: method,
                },
            },
            select: {
                protocol: true,
                metadata: true,
                entrypoint: true,
                target_host: true,
                target_path: true,
                out_http_method: true,
                entry_http_method: true,
            },
        });
        return items.map((x): Shape => ({
            protocol: x.protocol,
            hostname: x.target_host,
            entrypoint: x.entrypoint,
            targetPath: x.target_path,
            metadata: x.metadata as never,
            outHttpMethod: x.out_http_method.toLowerCase(),
            entryHttpMethod: x.entry_http_method.toLowerCase(),
        }));
    }, { async: true, resolvers: [String], length: 1 });

    export const isWebSocket = (route: Shape) => route.protocol === "ws";
}