import { MahjongGroupBase } from "./MahjongGroupClass";

const HZ = 49//红中

export class HZMahjong extends MahjongGroupBase {

    public allowListenAllNumber: boolean = true

    protected getAllCard(): number[] {
        const allCard = super.getAllCard()
        allCard.push(HZ)
        return allCard
    }

    protected takeChainNumber(targetNumber: number) {
        return targetNumber === HZ ? [] : super.takeChainNumber(targetNumber)
    }

}