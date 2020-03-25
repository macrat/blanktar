module.exports = {
    setupFiles: ['./jest.setup.ts'],
    testMatch: ['**/__tests__/**/*.js?(x)'],
    moduleNameMapper: {
        '~/(.+)': '<rootDir>/$1',
    },
    testPathIgnorePatterns: [
        '/.git/',
        '/.mdx-data/',
        '/.next/',
        '/.now/',
        '/node_modules/',
    ],
};
