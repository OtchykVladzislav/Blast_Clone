import { _decorator, CCInteger, Color, Component, EventTouch, find, instantiate, Node, ParticleSystem, ParticleSystem2D, Prefab, SpriteFrame, tween, Vec2, Vec3 } from 'cc';
import { Tile } from './Tile';
import { GridGenerator } from './GridGenerator';
import { GameController } from './GameController';
import { Bomb } from './TypeBonus/Bomb';
const { ccclass, property } = _decorator;

@ccclass('GridController')
export class GridController extends Component {
    @property (CCInteger)
    combination = 2;

    @property(Prefab)
    tileParticles = null

    @property(Prefab)
    explosionParticles = null

    @property(SpriteFrame)
    borderTile: SpriteFrame = null;
    
    @property([SpriteFrame])
    tiles: SpriteFrame[] = []

    private row: number = 9;
    private col: number = 9;

    gridGenerator: GridGenerator;

    gameController: GameController;

    start() {
        this.gameController = find('Canvas/GameController').getComponent(GameController)

        this.gridGenerator = new GridGenerator({
            row: this.row,
            col: this.col,
            symbols: this.tiles.length,
            combination: this.combination
        })

        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.col; j++){
                let elem = this.gridGenerator.grid[i][j]

                this.createTile(elem, i, j)
            }
        }
    }
    createTile(elem: number, i: number, j: number){
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

        return tile
    }

    onTileClick(event: EventTouch){
        const targetNode = event.target as Tile;

        if(this.gameController.isBonused && this.gameController.isBonused.name.split('-')[1] === 'bomb'){
            const bomb = new Bomb(this.gridGenerator.grid, this.row, this.col)
            const group = bomb.destroyTilesInRadius(targetNode.row, targetNode.col, this.gameController.bonusBombRadius)
            bomb.effectBombExplosion(targetNode, this.gameController.bonusBombRadius, this.explosionParticles)
            this.gameController.enableBonus(this.gameController.isBonused)
            this.removeGroup(group);
            this.gameController.move(group.length, targetNode)
        } else if(this.gameController.isBonused && this.gameController.isBonused.name.split('-')[1] === 'swap'){


        } else this.defaultClick(targetNode)
    }

    defaultClick(targetNode: Tile){
        const group = this.gridGenerator.findMatchingGroup(targetNode.row, targetNode.col, targetNode.index);
        
        if(targetNode.animation){
            targetNode.animation.stop()
            targetNode.position.set(targetNode.defaultPos)
        }

        const start_pos = targetNode.position.clone()

        if (group.length >= this.combination) {
            this.removeGroup(group);
            this.gameController.move(group.length, targetNode)
        } else {
            targetNode.animation = tween(targetNode)
            .to(0.05, {position: new Vec3(start_pos.x, start_pos.y, start_pos.z)})
            .to(0.05, {position: new Vec3(start_pos.x - 5, start_pos.y + 5, start_pos.z)})
            .to(0.05, {position: new Vec3(start_pos.x + 5, start_pos.y - 5, start_pos.z)})
            .to(0.05, {position: new Vec3(start_pos.x, start_pos.y, start_pos.z)})
            .repeat(5)
            .start()

            this.gameController.move(0)
        }
    }

    // Удаление группы символов
    removeGroup(group: Vec2[]) {
        for (const pos of group) {
            const { x: row, y: col } = pos;
            this.gridGenerator.grid[row][col] = 0; // Обнуляем ячейки (или можем поставить null/пустое значение)
            
            // Удаляем спрайт визуально
            const spriteNode = this.findTile(row, col)

            this.burnTileEffect(spriteNode)

            if (spriteNode) {
                spriteNode.destroy(); // Удаление спрайта
            }
        }

        // Обновляем поле (например, элементы падают вниз)
        this.animateGridUpdate();
    }

    // Анимация падения элементов и обновления сетки
    animateGridUpdate() {
        for (let col = 0; col < this.col; col++) {
            let emptyRow = 0;

            for (let row = 0; row < this.row; row++) {
                if (this.gridGenerator.grid[row][col] !== 0) {
                    // Если выше есть пустая ячейка
                    if (emptyRow !== row) {
                        const spriteNode = this.findTile(row, col) as Tile;
                        if (spriteNode) {
                            if(spriteNode.animation){
                                spriteNode.animation.stop()
                                spriteNode.position.set(spriteNode.defaultPos)
                            }

                            const targetPosition = new Vec3(spriteNode.position.x, (emptyRow * (spriteNode.size.visualHeight - 10)) + spriteNode.size.visualHeight / 2, 0);

                            spriteNode.row = emptyRow

                            // Анимация перемещения вниз
                            tween(spriteNode)
                                .to(0.2, { position: targetPosition })
                                .start();

                            // Обновляем данные в сетке
                            this.gridGenerator.grid[emptyRow][col] = this.gridGenerator.grid[row][col];
                            this.gridGenerator.grid[row][col] = 0;
                        }
                    }
                    emptyRow++;
                }
            }

            // Заполняем верхние пустые ячейки новыми символами с анимацией появления
            for (let row = emptyRow; row < this.row; row++) {
                const newSymbol = this.gridGenerator.getRandomSymbol();
                this.gridGenerator.grid[row][col] = newSymbol;

                const tile = this.createTile(newSymbol, row, col)

                const tile_pos = tile.position.clone()

                tile.setPosition(tile_pos.x, (tile_pos.y + tile.size.visualHeight) + tile.size.visualHeight / 2, 0); // Позиция выше на одну клетку

                tween(tile)
                    .to(0.2, { position: tile_pos }) // Анимация падения сверху
                    .start();
            }
        }
    }

    findTile(row: number, col: number){
        return this.node.children.find(e => {
            const tile = e as Tile
            return tile.row === row && tile.col === col
        })
    }

    burnTileEffect(tile: Node){
        const effect = instantiate(this.tileParticles)

        const effectSystem = effect.getComponent(ParticleSystem2D);

        effectSystem.startColor = this.changeColor((tile as Tile).index, true);
        effectSystem.endColor = this.changeColor((tile as Tile).index, false);

        const cont = find('Canvas/EffectContainer')

        effect.position.set(tile.position.clone().add(tile.parent.position))

        cont.addChild(effect)

        setTimeout(() => effect.destroy(), 300)
    }

    changeColor(index: number, start: boolean){
        const alpha = (start ? 255 : 0)

        const colors = [
            new Color(0, 85, 164, alpha),
            new Color(0, 135, 33, alpha),
            new Color(201, 52, 157, alpha),
            new Color(164, 7, 20, alpha),
            new Color(243, 151, 0, alpha)
        ]

        return colors[index - 1]
    }

}


