import { _decorator, find, instantiate, Prefab, Vec2 } from 'cc';
import { Tile } from '../Tile';
const { ccclass, property } = _decorator;

@ccclass('Bomb')
export class Bomb {
    grid: number[][];
    rows: number;
    cols: number;

    constructor(grid: number[][], rows: number, cols: number){
        this.grid = grid
        this.rows = rows
        this.cols = cols
    }

    destroyTilesInRadius(row: number, col: number, R: number) {
        const group: Vec2[] = [];

        for (let i = -R; i <= R; i++) {
            for (let j = -R; j <= R; j++) {
                const newRow = row + i;
                const newCol = col + j;

                // Проверяем, что индексы в пределах поля
                if (this.isWithinGrid(newRow, newCol)) {
                    group.push(new Vec2(newRow, newCol));
                }
            }
        }

        return group
    }

    isWithinGrid(row: number, col: number) {
        // Проверка, что клетка находится в пределах поля
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    effectBombExplosion(tile: Tile, radius: number, explosion: Prefab){
        
        const effect = instantiate(explosion)

        const cont = find('Canvas/EffectContainer')

        effect.position.set(tile.position.clone().add(tile.parent.position))

        effect.scale.multiplyScalar(radius)

        cont.addChild(effect)

        setTimeout(() => effect.destroy(), 300)
    }
}


