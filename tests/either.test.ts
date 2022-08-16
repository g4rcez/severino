import { describe, expect, test } from "vitest";
import { Either } from "../src/lib/either";

describe("Either", () => {
    test("Either left", () => {
        const either = Either({ left: 1 });
        expect(Either.isLeft(either)).toBe(true);
        expect(Either.isRight(either)).toBe(false);
    });

    test("Either right", () => {
        const either = Either({ right: 1 });
        expect(Either.isRight(either)).toBe(true);
        expect(Either.isLeft(either)).toBe(false);
    });
});
