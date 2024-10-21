import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DonateController')
export class DonateController extends Component {
    clickBack(){
        director.loadScene("GameScene")
    }
}


