module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['<rootDir>/assets/'],
    testMatch: ['**/*.test.ts'],  // Это указывает Jest искать файлы с расширением .test.ts для тестов
};