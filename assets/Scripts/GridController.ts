import { _decorator, CCBoolean, CCInteger, Component, EventTouch, math, Node, SpriteFrame, Vec3 } from 'cc';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('GridController')
export class GridController extends Component {
    @property (CCInteger)
    combination = 5;

    private row: number = 9;
    private col: number = 9;

    @property([SpriteFrame])
    tiles: SpriteFrame[] = []

    start() {
        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.col; j++){
                let rand = this.getRandomIntInclusive(1, 5)

                const tile = new Tile({
                    position: new Vec3(),
                    index: rand,
                    col: j,
                    max_col: this.col,
                    row: i,
                    max_row: this.row,
                    sprite: this.tiles[rand - 1]
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
        const targetNode = event.target as Node;

        // Удаляем спрайт (или скрываем его)
        targetNode.destroy();
    }

}


