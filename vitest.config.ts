import { defineConfig } from "vitest/config";

export default defineConfig({
    root: "./tests",
    test: {
        api: true,
        globals: true,
        root: "./tests",
        mockReset: true,
        clearMocks: true,
    },
});
