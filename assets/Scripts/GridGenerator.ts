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
        const groupsCount = Math.floor(Math.random() * 5) + 1; // Например, от 1 до 3 групп

        for (let i = 0; i < groupsCount; i++) {
            this.createRandomMatch();
        }
    }

    // Создаем одну случайную группу с совпадениями
    createRandomMatch() {
        const matchLength = Math.floor(Math.random() * this.combination) + 4; // Случайное количество символов (от this.combination до 5)
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
                    const group = this.findConnectedGroup(row, col, symbol, visited);
    
                    if (group.length >= this.combination || symbol === 99) {
                        return true; // Нашли группу, которая удовлетворяет условию
                    }
                }
            }
        }
    
        return false; // Совпадений не найдено
    }

    // Метод для поиска группы связанных клеток с одинаковыми символами
    findConnectedGroup(row: number, col: number, symbol: number, visited: boolean[][]): Vec2[] {
        const group: Vec2[] = [];
        
        const dfs = (r: number, c: number) => {
            if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
            if (visited[r][c] || this.grid[r][c] !== symbol) return;

            visited[r][c] = true;
            group.push(new Vec2(r, c));

            // Рекурсивно проверяем соседние клетки (по горизонтали, вертикали и диагоналям)
            dfs(r + 1, c); // вниз
            dfs(r - 1, c); // вверх
            dfs(r, c + 1); // вправо
            dfs(r, c - 1); // влево
        };

        dfs(row, col);
        return group;
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


