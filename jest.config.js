module.exports = {
    testEnvironment: 'node',
    transform: {
        '\\.tsx?$': 'ts-jest',
        '\\.jsx?$': 'babel-jest',
    },
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
    },

    setupFiles: [
        './jest.setup.ts',
    ],
    testMatch: [
        '**/*.test.[tj]s?(x)',
        '<rootDir>/tests/**/*.[tj]s?(x)',
    ],
    testPathIgnorePatterns: [
        '/.git/',
        '/.mdx-data/',
        '/.next/',
        '/.now/',
        '/node_modules/',
    ],
};
