module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/tests/**/*.test.(ts|js)'],  // Указываем путь к тестам
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        }
    }
};