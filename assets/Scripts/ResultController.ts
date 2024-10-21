import { _decorator, Color, Component, find, Label, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResultController')
export class ResultController extends Component {
    onLoad(): void {
        const resultData = globalThis.gameResultData;
        if (resultData) {
            const { score, title } = resultData;
            const value = {score: 0}

            // Устанавливаем заголовок и счёт
            const titleLabel = find('Canvas/UI/title').getComponent(Label);

            if(title.includes('ПРОИГРАЛ')) titleLabel.color = new Color(255, 0, 0, 255)

            titleLabel.string = title;

            const scoreLabel = find('Canvas/UI/score').getComponent(Label);

            tween(value)
            .to(0.3, {score: score}, {
                onUpdate(target: any) {
                    scoreLabel.string = `ТВОИ ОЧКИ: ${target.score.toFixed(0)}`;
                }
            }).start()
            
        }
    }
}


