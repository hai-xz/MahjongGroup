import { MahjongGroupBase } from "./MahjongGroupClass";


/** 带有风牌与箭牌的麻将，允许风牌（西北东不算）箭牌组成顺子 */
export class MahjongMore extends MahjongGroupBase {

    protected getAllCard() {
        const allCard = super.getAllCard()
        allCard.push(...new Array(4).fill(0).map((_, i) => i + 1 + 48)) //东南西北
        allCard.push(...new Array(3).fill(0).map((_, i) => i + 1 + 64)) //中发白
        return allCard
    }

    //允许风牌（西北东不算） 箭牌组成顺子
    protected takeChainNumber(targetNumber: number): number[][] {
        if (targetNumber < 48) {
            return super.takeChainNumber(targetNumber)
        } else if (targetNumber > 64) {
            return [[65, 66, 67]]
        } else {
            const i = targetNumber % 16
            const base = Math.floor(targetNumber / 16) * 16
            const [floor, ceil] = [base + Math.max(1, i - 2), base + Math.min(1, i)]
            return new Array(ceil - floor + 1).fill(floor).map((_, i) => [floor + i, floor + i + 1, floor + i + 2])
        }
    }
}

