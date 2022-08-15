import { describe, expect, test } from "vitest";
import { Dates } from "../src/lib/dates";

describe("Dates", () => {
    test("nextDay", () => {
        const date = new Date("1970-01-01T00:00:00.000Z");
        expect(Dates.nextDay(date).toISOString()).toBe("1970-01-02T02:59:59.999Z");
    });

    test("epoch - zero time", () => {
        const date = new Date("1970-01-01T00:00:00.000Z");
        expect(Dates.epoch(date)).toBe(0);
    });

    test("epoch", () => {
        const date = new Date("1970-01-02T00:00:00.000Z");
        expect(Dates.epoch(date)).toBe(86400);
    });
});
