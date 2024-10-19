import { _decorator, Component, Node, UITransform, Label, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {

    @property(Node)
    barFill: Node = null;

    eventTarget = new EventTarget();

    max: number = 100; 
    private current: number = 0; 

    
    updateBar(health: number) {
        this.current = health;
        const percent = this.current / this.max;

        
        const healthBarWidth = this.barFill.getComponent(UITransform).contentSize.width;
        this.barFill.getComponent(UITransform).width = healthBarWidth * percent;


        if(this.current === 0) this.eventTarget.emit('dead');
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