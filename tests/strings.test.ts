import { describe, expect, test } from "vitest";
import { Strings } from "../src/lib/strings";

describe("Strings", () => {
    test("normalize", () => {
        expect(Strings.normalizePath("/caf%C3%A9")).toBe("/café");
    });
});
