import { randomUUID, createHmac } from "node:crypto";
import { db } from "../lib/database";
import { Either } from "../lib/either";
import type { users as UserDB } from "@prisma/client";

export namespace Users {
    const users = db.users;

    const generatePassword = (email: string, password: string) =>
        createHmac("sha512", `${email}#${password}`).digest("base64").toString();

    type User = {
        email: string;
        password: null;
        createdAt: Date;
        nickname: string;
        id: string;
        name: string;
        updatedAt: Date;
    };

    const mapUser = (user: UserDB): User => ({
        createdAt: new Date(user.created_at),
        email: user.email,
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        password: null,
        updatedAt: new Date(user.updated_at),
    });

    export const create = async (name: string, email: string, nickname: string, password: string) => {
        const now = new Date();
        const id = randomUUID();
        const hashPassword = generatePassword(email, password);
        const user = await users.create({
            data: { created_at: now, email, name, nickname, updated_at: now, id, password: hashPassword },
        });
        return { ...user, password: null };
    };

    export type AuthUser = User & { claims: string[] };

    export const findByEmailAndPassword = async (email: string, password: string) => {
        const user = await users.findFirst({
            where: {
                email,
                password: generatePassword(email, password),
            },
        });
        if (user === null) {
            return Either.left(new Error(`Cannot found ${email}`));
        }
        const claims = await db.claims.findMany({
            select: {
                name: true,
            },
            where: {
                usersId: user?.id,
            },
        });
        const authUser = { claims: claims.map((x) => x.name), ...mapUser(user) };
        return Either.right<AuthUser>(authUser);
    };
}
