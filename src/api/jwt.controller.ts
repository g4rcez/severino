import { createDecoder, createSigner, createVerifier, TokenError } from "fast-jwt";
import { Dates } from "../lib/dates";
import { application } from "../model/application";
import { Either } from "../lib/either";

namespace JwtSemver {
    type Number = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

    type Versioning = {
        signer: ReturnType<typeof createSigner>;
        decoder: ReturnType<typeof createDecoder>;
        verifier: ReturnType<typeof createVerifier>;
        semver: `${Number}.${Number}.${Number}${Number | ""}`;
    };

    export const v1: Versioning = {
        semver: "0.0.1",
        decoder: createDecoder({ complete: true }),
        verifier: createVerifier({
            key: async () => application.token(),
        }),
        signer: createSigner({
            algorithm: "HS512",
            aud: application.issuer,
            jti: application.version(),
            key: async () => application.token(),
        }),
    };

    export const versioningMap = new Map<string, Versioning>([[v1.semver, v1]]);
}

export namespace Jwt {
    const jwt = JwtSemver.v1;
    type JwtPayload = Record<string, number | string | string[] | Date>;

    export type PublicPayload = {
        aud: string;
        email: string;
        exp: number;
        iat: number;
        iss: string;
        roles: string[];
        sub: string;
        uid: string;
        version: string;
    };

    export const validate = async (token: string) => {
        try {
            const { payload } = jwt.decoder(token);
            const jwtVersionVerifier = JwtSemver.versioningMap.get(payload.version);
            if (jwtVersionVerifier === undefined) return Either.left(new Error("Not verified JWT"));
            await jwtVersionVerifier.verifier(token);
            return Either.right(payload);
        } catch (error) {
            if (error instanceof TokenError) {
                console.log(error);
            }
            return Either.left(error);
        }
    };

    export const create = (userId: string, issuer: string, email: string, roles: string[] = []) => {
        const now = new Date();
        const payload: JwtPayload = {
            email,
            issuer,
            roles,
            nbf: now,
            uid: userId,
            version: jwt.semver,
            iss: application.issuer,
            sub: application.type(),
            exp: Dates.epoch(Dates.nextDay(now)),
        };
        return jwt.signer(payload);
    };
}
