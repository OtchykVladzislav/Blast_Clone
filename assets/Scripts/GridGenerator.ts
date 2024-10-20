import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GridGenerator')
export class GridGenerator {
    symbols: number;

    rows: number;

    cols: number;

    combination: number;

    grid: number[][];

    constructor({row, col, symbols, combination}){
        this.rows = row;

        this.cols = col;

        this.symbols = symbols;

        this.combination = combination

        this.grid = []

        this.generateGridWithRandomMatches()
    }

    generateGridWithRandomMatches() {
        // Создаем пустую сетку
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

        // Заполняем сетку случайными символами
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = this.getRandomSymbol();
            }
        }

        // Генерируем несколько групп с случайным количеством совпадений
        const groupsCount = Math.floor(Math.random() * 3) + 1; // Например, от 1 до 3 групп

        for (let i = 0; i < groupsCount; i++) {
            this.createRandomMatch();
        }
    }

    // Создаем одну случайную группу с совпадениями
    createRandomMatch() {
        const matchLength = Math.floor(Math.random() * this.combination) + 3; // Случайное количество символов (от this.combination до 5)
        const matchSymbol = this.getRandomSymbol();
        
        // Случайный выбор типа совпадения: горизонтальное или вертикальное
        const isHorizontal = Math.random() < 0.5;

        if (isHorizontal) {
            // Горизонтальное совпадение
            const row = Math.floor(Math.random() * this.rows);
            const colStart = Math.floor(Math.random() * (this.cols - matchLength));

            for (let col = colStart; col < colStart + matchLength; col++) {
                this.grid[row][col] = matchSymbol;
            }
        } else {
            // Вертикальное совпадение
            const col = Math.floor(Math.random() * this.cols);
            const rowStart = Math.floor(Math.random() * (this.rows - matchLength));

            for (let row = rowStart; row < rowStart + matchLength; row++) {
                this.grid[row][col] = matchSymbol;
            }
        }
    }

    checkForMatches(): boolean {
        const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!visited[row][col]) {
                    const symbol = this.grid[row][col];

                    // Проверяем горизонтальные и вертикальные группы
                    const horizontalMatch = this.checkHorizontalMatch(row, col, symbol, visited);
                    const verticalMatch = this.checkVerticalMatch(row, col, symbol, visited);

                    if (horizontalMatch || verticalMatch) {
                        return true; // Если хотя бы одна группа найдена
                    }
                }
            }
        }

        return false; // Если не нашли ни одной группы
    }

    // Проверка горизонтальных совпадений
    checkHorizontalMatch(row: number, col: number, symbol: number, visited: boolean[][]): boolean {
        let count = 1;

        for (let c = col + 1; c < this.cols && this.grid[row][c] === symbol; c++) {
            count++;
        }

        if (count >= 3) {
            // Отмечаем посещённые ячейки
            for (let c = col; c < col + count; c++) {
                visited[row][c] = true;
            }
            return true; // Нашли горизонтальное совпадение
        }

        return false;
    }

    // Проверка вертикальных совпадений
    checkVerticalMatch(row: number, col: number, symbol: number, visited: boolean[][]): boolean {
        let count = 1;

        for (let r = row + 1; r < this.rows && this.grid[r][col] === symbol; r++) {
            count++;
        }

        if (count >= 3) {
            // Отмечаем посещённые ячейки
            for (let r = row; r < row + count; r++) {
                visited[r][col] = true;
            }
            return true; // Нашли вертикальное совпадение
        }

        return false;
    }

    // Поиск группы совпадающих символов
    findMatchingGroup(row: number, col: number, symbol: number): Vec2[] {
        const group: Vec2[] = [];
        const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));

        const dfs = (r: number, c: number) => {
            if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
            if (visited[r][c] || this.grid[r][c] !== symbol) return;

            visited[r][c] = true;
            group.push(new Vec2(r, c));

            // Проверяем соседние клетки
            dfs(r + 1, c);
            dfs(r - 1, c);
            dfs(r, c + 1);
            dfs(r, c - 1);
        };

        dfs(row, col);
        return group;
    }

    // Получаем случайный символ
    getRandomSymbol(): number {
        return Math.floor(Math.random() * this.symbols) + 1; // Символы от 1 до symbols
    }
}


