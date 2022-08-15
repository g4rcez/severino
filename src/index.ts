import { Env } from "./env";
import { application } from "./model/application";
import { Server } from "./server";

async function main() {
    Env.checkMandatory();
    await application.init();
    const app = await Server.init();
    process.on("SIGINT", () => app.close(() => process.exit(0)));
}

main();
