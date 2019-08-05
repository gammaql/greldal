const path = require('path');

module.exports = {
    transform: {
        ".(ts|tsx)": "ts-jest"
    },
    testEnvironment: "node",
    testRegex: "\\.spec\\.ts$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/test/"
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95
        }
    },
    collectCoverage: false,
    collectCoverageFrom: [
        "src/*.ts"
    ],
    snapshotResolver: './config/snapshot-resolver.js'
};
