import { _decorator, CCInteger, Component, find, Label, Node } from 'cc';
import { ScoreBar } from './ScoreBar';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
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

    move(amount: number){
        if(amount){
            this.updateScoreCount(this.priceTile * amount)
        }

        this.updateMoveCount(1)
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


