import { _decorator, Component, Node, Sprite, SpriteFrame, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Node {

    index: number;

    max_row: number;

    max_col: number;

    col: number;

    row: number;

    size: any;

    sprite: SpriteFrame;

    constructor({position, index, col, max_col, row, max_row, sprite}) {
        super()

        this.position = position

        this.index = index

        this.row = row

        this.col = col

        this.sprite = sprite

        this.max_row  = max_row

        this.max_col = max_col

        this.create()
    }

    create() {
        const sprite = this.addComponent(Sprite);

        sprite.spriteFrame = this.sprite;

        this.calcuclatePosition(sprite)
    }

    calcuclatePosition(sprite: Sprite): void{
        const position = new Vec3()
        const size = this.calculateSize(sprite)

        const start_point = (this.max_col - 1) / 2

        position.x = -(start_point * size.visualWidth) + (this.col * size.visualWidth)

        position.y = this.row * (size.visualHeight - 10)
 
        position.y += size.visualHeight / 2

        this.position.set(position)

        this.size = size
    }

    calculateSize(sprite: Sprite) {
        if (sprite && sprite.spriteFrame) {
            // Получаем текстуру
            const texture = sprite.spriteFrame.texture;

            // Получаем размеры текстуры
            const width = texture.width;
            const height = texture.height;

            const scale = this.getScale();

            // Визуальные размеры спрайта с учетом масштаба узла
            const visualWidth = width * scale.x;
            const visualHeight = height * scale.y;

            return {visualWidth, visualHeight}
        }
    }
}


