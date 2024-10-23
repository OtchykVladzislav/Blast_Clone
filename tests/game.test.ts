import { GridGenerator } from "../assets/Scripts/GridGenerator";

describe('GridGenerator Tests', () => {
    test('GridGenerator should initialize with correct values', () => {
        const gridGen = new GridGenerator({ row: 5, col: 5, symbols: 3, combination: 3 });

        expect(gridGen.rows).toBe(5);
        expect(gridGen.cols).toBe(5);
        expect(gridGen.symbols).toBe(3);
        expect(gridGen.combination).toBe(3);
        expect(gridGen.grid.length).toBe(5);
        expect(gridGen.grid[0].length).toBe(5);
    });

    test('generateGridWithRandomMatches should fill the grid with random symbols', () => {
        const gridGen = new GridGenerator({ row: 5, col: 5, symbols: 3, combination: 3 });

        gridGen.generateGridWithRandomMatches();
        
        // Проверим, что все клетки содержат символы в диапазоне [1, symbols]
        gridGen.grid.forEach(row => {
            row.forEach(cell => {
                expect(cell).toBeGreaterThanOrEqual(1);
                expect(cell).toBeLessThanOrEqual(3);
            });
        });
    });

    test('checkForMatches should return true when there are matches in the grid', () => {
        const gridGen = new GridGenerator({ row: 5, col: 5, symbols: 3, combination: 3 });

        // Задаем сетку с горизонтальным совпадением
        gridGen.grid = [
            [1, 1, 1, 0, 0],
            [0, 2, 2, 2, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        const hasMatches = gridGen.checkForMatches();
        expect(hasMatches).toBe(true);
    });

    test('findMatchingGroup should return the correct group of matching symbols', () => {
        const gridGen = new GridGenerator({ row: 5, col: 5, symbols: 3, combination: 3 });

        gridGen.grid = [
            [1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        const group = gridGen.findMatchingGroup(0, 0, 1);
        expect(group.length).toBe(3);
    });

    test('getRandomSymbol should return a value within the correct range', () => {
        const gridGen = new GridGenerator({ row: 5, col: 5, symbols: 3, combination: 3 });

        for (let i = 0; i < 100; i++) {
            const symbol = gridGen.getRandomSymbol();
            expect(symbol).toBeGreaterThanOrEqual(1);
            expect(symbol).toBeLessThanOrEqual(3);
        }
    });

    test('createRandomMatch should create valid random matches', () => {
        const gridGen = new GridGenerator({ row: 5, col: 5, symbols: 3, combination: 3 });

        // Создаем сетку
        gridGen.generateGridWithRandomMatches();

        // Проверим, что после создания совпадений, хотя бы одна группа будет найдена
        gridGen.createRandomMatch();
        const hasMatches = gridGen.checkForMatches();
        expect(hasMatches).toBe(true);
    });
});