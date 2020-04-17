module.exports = {
    setupFiles: ['./jest.setup.ts'],
    testMatch: ['**/__tests__/**/*.(js|jsx|ts|tsx)'],
    moduleNameMapper: {
        '~/(.+)': '<rootDir>/$1',
    },
    transform: {
        '\\.(ts|tsx)$': 'ts-jest',
        '\\.svg$': 'jest-raw-loader',
    },
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
    testPathIgnorePatterns: [
        '/.git/',
        '/.mdx-data/',
        '/.next/',
        '/.now/',
        '/node_modules/',
    ],
};
