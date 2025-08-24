module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/index.ts",
        "!src/__tests__/**",
    ],
    setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
    moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@models/(.*)$": "<rootDir>/src/models/$1",
        "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
    },
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
