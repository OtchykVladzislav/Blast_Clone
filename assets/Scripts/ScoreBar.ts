import { _decorator, Component, Node, UITransform, Label, EventTarget, tween, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreBar')
export class ScoreBar extends Component {

    eventTarget = new EventTarget();

    max: number = 100; 
    private current: number = 0; 

    
    updateBar(amount: number) {
        this.current = amount;
        const percent = this.current / this.max;

        const bar_progress = this.node.getComponent(ProgressBar);

        tween(bar_progress).to(
            0.2,
            {progress: percent}
        ).start();

        if(this.current === this.max) this.eventTarget.emit('finish');
    }

    
    decrease(amount: number) {
        this.current -= amount;
        if (this.current < 0) this.current = 0;
        this.updateBar(this.current);
    }

    
    increase(amount: number) {
        this.current += amount;
        if (this.current > this.max) this.current = this.max;
        this.updateBar(this.current);
    }
}