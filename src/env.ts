import { z } from "zod";

enum NodeEnv {
    Test = "test",
    Development = "development",
    Production = "production",
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            NODE_ENV: NodeEnv;
        }
    }
}

const mandatoryEnv = z.object({
    PORT: z.string().default("5000"),
    NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.Production),
});

export namespace Env {
    export const checkMandatory = () => {
        const validation = mandatoryEnv.safeParse(process.env);
        if (validation.success) return true;
        throw validation.error.cause;
    };
    export const PORT = Number.parseInt(process.env.PORT ?? "5000", 10);
}
