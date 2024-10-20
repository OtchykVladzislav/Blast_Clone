import { _decorator, CCInteger, Component, find, instantiate, Label, Node, Prefab, tween, UIOpacity, Vec3 } from 'cc';
import { ScoreBar } from './ScoreBar';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property (Prefab)
    scorePrefab = null;

    @property (CCInteger)
    moves = 40;

    @property (CCInteger)
    score = 250;

    @property(CCInteger)
    priceTile = 10;

    currentScore: number = 0;
    currentMove: number = this.moves

    private UI_PATH = 'Canvas/UI/'

    private progress: ScoreBar;

    start() {
        this.updateMoveCount(0)

        this.progress = find(this.UI_PATH + 'ProgressContainer/progress-bar').getComponent(ScoreBar)

        this.progress.max = this.score

    }

    move(amount: number, tile: Tile = null){
        if(amount){
            this.animScore(amount, tile)

            this.updateScoreCount(this.priceTile * amount)
        }

        this.updateMoveCount(1)
    }

    animScore(amount: number, tile: Tile){
        const score = instantiate(this.scorePrefab)

        const position = new Vec3()

        position.add(tile.position).add(tile.parent.position)

        const cont = find('Canvas/EffectContainer')

        score.getComponent(Label).string = '+' + (this.priceTile * amount)

        score.position.set(position)

        cont.addChild(score)

        const start_pos = score.position.clone()

        tween(score)
        .to(0.35, {position: new Vec3(start_pos.x, start_pos.y + 100, start_pos.z)}, {onComplete: () => {
            if(score) score.destroy()
        }})
        .start()

        tween(score.getComponent(UIOpacity))
        .to(0.3, {opacity: 0})
        .start()

    }

    updateMoveCount(amount: number): void{
        const move = find(this.UI_PATH + 'InfoContainer/move-count').getComponent(Label)

        this.currentMove -= amount
        
        move.string = '' + this.currentMove
    }

    updateScoreCount(amount: number): void{
        const score = find(this.UI_PATH + 'InfoContainer/score-count').getComponent(Label)

        this.currentScore += amount

        this.progress.increase(amount)

        score.string = '' + this.currentScore

    }
}


