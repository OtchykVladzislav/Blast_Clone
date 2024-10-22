import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Tile } from '../Tile';
const { ccclass, property } = _decorator;

@ccclass('Teleport')
export class Teleport {
    constructor(){

    }

    bonusEvent(targets: any[], grid: number[][]){
        targets.map((e: any) => {
            if(e.border) e.border.destroy()
        })

        const target1 = targets[0].target
        const target2 = targets[1].target

        const target_pos_1 = target1.position.clone()
        const target_pos_2 = target2.position.clone()

        const target_symbol_1 = target1.index
        const target_symbol_2 = target2.index

        const target_params_1 = {row: target1.row, col: target1.col}
        const target_params_2 = {row: target2.row, col: target2.col}

        grid[target1.row][target1.col] = target_symbol_2
        grid[target2.row][target2.col] = target_symbol_1

        target1.col = target_params_2.col
        target1.row = target_params_2.row

        target2.col = target_params_1.col
        target2.row = target_params_1.row

        tween(target1)
        .to(0.2, {scale: new Vec3(0, 0, 0)}, {onComplete: () => {
            target1.position.set(target_pos_2)
        }})
        .to(0.2, {scale: new Vec3(1, 1, 1)})
        .start()

        tween(target2)
        .to(0.2, {scale: new Vec3(0, 0, 0)}, {onComplete: () => {
            target2.position.set(target_pos_1)
        }})
        .to(0.2, {scale: new Vec3(1, 1, 1)})
        .start()
    }

    
}


