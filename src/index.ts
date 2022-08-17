import { Env } from "./env";
import { application } from "./model/application";
import { Server } from "./server";
import { ProxyRouter } from "./api/proxy-router.middleware";
import { db } from "./lib/database";

async function main() {
    Env.checkMandatory();
    await application.init();
    const app = await Server.init();
    const onClose = async (...args: any[]) => {
        console.log(args);
        await db.$disconnect();
        ProxyRouter.proxy.close();
        app.close(() => {
            process.exit(0);
        });
    };
    process.on("SIGINT", onClose);
    process.on("SIGTERM", onClose);

    process.on("uncaughtException", onClose);
    process.on("unhandledRejection", onClose);
}

main().catch(console.error);
