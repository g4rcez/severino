import { z } from "zod";
import { Either } from "../lib/either";
import { Http } from "../lib/http";
import { application } from "../model/application";
import { Users } from "../model/users";
import { Jwt } from "./jwt.controller";

export namespace UserController {
    const password = z
        .string()
        .min(2)
        .max(512)
        // https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
        .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/);

    const createSchema = z.object({
        email: z.string().email().max(512),
        name: z.string().min(2).max(512),
        password,
        nickname: z
            .string()
            .min(2)
            .max(32)
            // https://unix.stackexchange.com/questions/157426/what-is-the-regex-to-validate-linux-users
            .regex(/^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/),
    });

    const loginSchema = z.object({ email: z.string().email().max(512), password });

    export const New = Http.endpoint(async (req, res) => {
        const input = createSchema.safeParse(req.body);
        if (!input.success) {
            console.log("->", input.error.issues);
            return res.status(400).json({
                errors: input.error.issues.map((x) => x.message),
            });
        }
        const user = await Users.create(input.data.name, input.data.email, input.data.nickname, input.data.password);
        return res.json(user);
    });

    export const Login = Http.endpoint(async (req, res) => {
        const input = loginSchema.safeParse(req.body);
        if (!input.success) {
            return res.status(400).json({ errors: input.error.issues.map((x) => x.message) });
        }
        const user = await Users.findByEmailAndPassword(input.data.email, input.data.password);
        if (Either.isLeft(user)) {
            return res.status(Http.BAD_REQUEST).json({ errors: user.left.message });
        }
        const accessToken = await Jwt.create(application.issuer, user.right.email, user.right.claims);
        return res.json({ user: user.right, accessToken });
    });
}
