import { _decorator, CCBoolean, CCInteger, Component, EventTouch, math, Node, SpriteFrame, tween, Vec2, Vec3 } from 'cc';
import { Tile } from './Tile';
import { GridGenerator } from './GridGenerator';
const { ccclass, property } = _decorator;

@ccclass('GridController')
export class GridController extends Component {
    @property (CCInteger)
    combination = 2;

    private row: number = 9;
    private col: number = 9;

    @property([SpriteFrame])
    tiles: SpriteFrame[] = []

    gridGenerator: GridGenerator;

    start() {
        this.gridGenerator = new GridGenerator({
            row: this.row,
            col: this.col,
            symbols: this.tiles.length,
            combination: this.combination
        })

        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.col; j++){
                let elem = this.gridGenerator.grid[i][j]

                const tile = new Tile({
                    position: new Vec3(),
                    index: elem,
                    col: j,
                    max_col: this.col,
                    row: i,
                    max_row: this.row,
                    sprite: this.tiles[elem - 1]
                })

                tile.on(Node.EventType.TOUCH_END, this.onTileClick, this);

                this.node.addChild(tile)
            }
        }
    }

    update(deltaTime: number) {
        
    }

    getRandomIntInclusive(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }

    onTileClick(event: EventTouch){
        const targetNode = event.target as Tile;

        const group = this.gridGenerator.findMatchingGroup(targetNode.row, targetNode.col, targetNode.index);

        const start_pos = targetNode.position.clone()

        if (group.length >= this.combination) {
            this.removeGroup(group);
        } else {
            tween(targetNode)
            .to(0.05, {position: new Vec3(start_pos.x, start_pos.y, start_pos.z)})
            .to(0.05, {position: new Vec3(start_pos.x - 5, start_pos.y + 5, start_pos.z)})
            .to(0.05, {position: new Vec3(start_pos.x + 5, start_pos.y - 5, start_pos.z)})
            .to(0.05, {position: new Vec3(start_pos.x, start_pos.y, start_pos.z)})
            .repeat(5)
            .start()
        }

        // Удаляем спрайт (или скрываем его)
        //targetNode.destroy();
    }

    // Удаление группы символов
    removeGroup(group: Vec2[]) {
        for (const pos of group) {
            const { x: row, y: col } = pos;
            this.gridGenerator.grid[row][col] = 0; // Обнуляем ячейки (или можем поставить null/пустое значение)
            
            // Удаляем спрайт визуально
            const spriteNode = this.node.getChildByName(`tile_${row}_${col}`);

            console.log(spriteNode)

            if (spriteNode) {
                spriteNode.destroy(); // Удаление спрайта
            }
        }

        // Обновляем поле (например, элементы падают вниз)
        //this.updateGrid();
    }

}


