import { randomUUID } from "node:crypto";
import { Dates } from "../lib/dates";
import { Nullable } from "../lib/utility.types";
import { Secrets } from "./secrets";

class Application {
    public secret: Nullable<Secrets.Item>;
    public issuer = "application-name";
    constructor() {
        this.secret = null;
    }

    public init = async () => {
        let secret = await Secrets.lastSecret();
        if (secret === null) {
            secret = await Secrets.create(randomUUID(), Dates.nextDay(new Date()));
        }
        this.secret = secret;
    };

    public token = () => this.secret?.token!;

    public expiresIn = () => this.secret?.expires_in!;

    public version = () => this.secret?.token!;

    public type = () => this.secret?.type!;
}

export const application = new Application();
