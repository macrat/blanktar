module.exports = {
    setupFiles: ['./jest.setup.ts'],
    testMatch: ['**/__tests__/**/*.js?(x)'],
    testPathIgnorePatterns: [
        '/.git/',
        '/.mdx-data/',
        '/.next/',
        '/.now/',
        '/node_modules/',
    ],
};
