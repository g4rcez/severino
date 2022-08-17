import { Jwt } from "./jwt.controller";
import { z } from "zod";
import { Either } from "../lib/either";
import { Http } from "../lib/http";
import { application } from "../model/application";
import { Users } from "../model/users";

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
            .regex(/^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/).superRefine(async (value, context) => {
                const exist = await Users.existByNickname(value);
                if (exist) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Nickname '${value}' already exist.`,
                    });
                }
            }),
    });

    const loginSchema = z.object({ email: z.string().email().max(512), password });

    export const create = Http.endpoint(async (req, res) => {
        const input = await createSchema.safeParseAsync(req.body);
        if (!input.success) {
            return res.status(Http.BAD_REQUEST).json({ errors: input.error.issues });
        }
        const user = await Users.create(input.data.name, input.data.email, input.data.nickname, input.data.password);
        return res.json(user);
    });

    export const login = Http.endpoint(async (req, res) => {
        const input = loginSchema.safeParse(req.body);
        if (!input.success) {
            return res.status(Http.BAD_REQUEST).json({ errors: input.error.issues.map((x) => x.message) });
        }
        const user = await Users.findByEmailAndPassword(input.data.email, input.data.password);
        if (Either.isLeft(user)) {
            return res.status(Http.BAD_REQUEST).json({ errors: user.left.message });
        }
        const accessToken = await Jwt.create(user.right.id, application.issuer, user.right.email, user.right.claims);
        return res.json({ user: user.right, accessToken });
    });

    export const getById = Http.endpoint(async (req, res) => {
        const id = req.params.id as string;
        try {
            const user = await Users.findById(id);
            if (Either.isLeft(user)) {
                return res.status(Http.NOT_FOUND).json({ message: "NotFound" });
            }
            return res.json({ user: user.right });
        } catch (e) {
            return res.status(Http.INTERNAL_SERVER_ERROR).json({ message: "InternalServerError" });
        }
    });
}
