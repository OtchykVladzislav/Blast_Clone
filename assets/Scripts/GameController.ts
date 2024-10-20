import { _decorator, CCInteger, Component, find, Label, Node } from 'cc';
import { ProgressBar } from './ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property (CCInteger)
    moves = 40;

    @property (CCInteger)
    score = 250;

    currentScore: number = 0;
    currentMove: number = this.moves

    private UI_PATH = 'Canvas/UI/'

    private progress: ProgressBar;

    start() {
        this.updateMoveCount()

        this.progress = find(this.UI_PATH + 'ProgressContainer/progress-bar').getComponent(ProgressBar)

        this.progress.max = this.score

    }

    updateMoveCount(): void{
        const move = find(this.UI_PATH + 'InfoContainer/move-count').getComponent(Label)
        
        move.string = '' + this.currentMove
    }

    updateScoreCount(amount: number): void{
        const score = find(this.UI_PATH + 'InfoContainer/score-count').getComponent(Label)

        this.currentScore += amount

        this.progress.updateBar(amount)

        score.string = '' + this.currentScore

    }
}


