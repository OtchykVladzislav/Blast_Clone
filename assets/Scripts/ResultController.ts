import { _decorator, Color, Component, find, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResultController')
export class ResultController extends Component {
    onLoad(): void {
        const resultData = globalThis.gameResultData;
        if (resultData) {
            const { score, title } = resultData;

            // Устанавливаем заголовок и счёт
            const titleLabel = find('Canvas/UI/title').getComponent(Label);

            if(title.includes('ПРОИГРАЛ')) titleLabel.color = new Color(255, 0, 0, 255)

            titleLabel.string = title;

            const scoreLabel = find('Canvas/UI/score').getComponent(Label);
            scoreLabel.string = `ТВОИ ОЧКИ: ${score}`;
        }
    }
}


