import { _decorator, Camera, CCInteger, Component, director, EventTouch, find, instantiate, Label, Node, Prefab, screen, Size, tween, UIOpacity, UITransform, Vec3, Widget } from 'cc';
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

    @property(CCInteger)
    currentCoin = 9999999;

    @property (CCInteger)
    bonusBombRadius = 1;

    state: string = 'gameplay';

    isBonused: Node = null;

    currentScore: number = 0;
    currentMove: number = 0;

    private UI_PATH = 'Canvas/UI/'

    private progress: ScoreBar;

    start() {
        this.currentMove = this.moves

        this.updateMoveCount(0)

        this.updateCoinCount(0)

        this.progress = find(this.UI_PATH + 'ProgressContainer/progress-bar').getComponent(ScoreBar)

        this.progress.max = this.score

        this.progress.eventTarget.on('finish', () => this.onGameEnd(true), this)
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

    updateCoinCount(amount: number): void{
        if(!this.currentCoin) return;
        const value = {coin: this.currentCoin}

        const coin = find(this.UI_PATH + 'DonateContainer/coin-count').getComponent(Label)

        tween(value)
        .to(0.3, {coin: this.currentCoin - amount}, {
            onUpdate(target: any) {
                coin.string = '' + target.coin.toFixed(0)
            }
        }).start()
    }

    updateMoveCount(amount: number): void{
        const move = find(this.UI_PATH + 'InfoContainer/move-count').getComponent(Label)

        this.currentMove -= amount
        
        move.string = '' + this.currentMove

        if(!this.currentMove) this.onGameEnd(false)
    }

    updateScoreCount(amount: number): void{
        const value = {score: this.currentScore}
        const score = find(this.UI_PATH + 'InfoContainer/score-count').getComponent(Label)

        this.currentScore += amount

        this.progress.increase(amount)

        tween(value)
        .to(0.3, {score: this.currentScore}, {
            onUpdate(target: any) {
                score.string = '' + target.score.toFixed(0)
            }
        }).start()
    }

    onGameEnd(reason: boolean) : void {
        if(this.state === 'cta') return;

        this.state = 'cta'

        globalThis.gameResultData = { 
            score: this.currentScore,
            title: (reason ? 'ПОБЕДА!!' : 'ПРОИГРАЛ;(')
        };

        setTimeout(() => director.loadScene("ResultScene"), 500)
    }

    onDonateScreen() : void {
        director.loadScene("DonateScene")
    }

    clickBonus(event: EventTouch){
        if(this.isBonused) return;

        this.isBonused = event.currentTarget

        this.updateCoinCount(+this.isBonused.getComponentInChildren(Label).string)

        event.currentTarget.parent.children.map((e: Node, i: number) => {
            if(i) e.children[4].active = true
        })
    }

    enableBonus(node: Node){
        if(!this.isBonused) return;

        this.isBonused = null

        node.parent.children.map((e: Node, i: number) => {
            if(i) e.children[4].active = false
        })
    }
}


