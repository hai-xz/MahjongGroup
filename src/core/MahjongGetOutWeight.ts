import { MahjongGroupBase } from "./MahjongGroupClass"

type GetNumberRemainingType = (n: number) => number

export class MajhongGetOutWeight {

    public readonly deep: number = 0
    public readonly magicCount: number = 0
    public readonly handList: number[] = null
    public readonly otherGroupList: number[][] = null
    public readonly outCardWeightMap: Map<number, number> = new Map()
    public readonly getNumberRemaining: GetNumberRemainingType = () => 1

    /**
     * 获取合适的出牌
     * @param handList 手牌列表
     * @param otherGroupList 吃碰杠的数据
     * @param magicCount 几张鬼牌
     * @param deep 深度
     * @param getNumberRemaining 获取牌桌某张牌还剩几张
     */
    public constructor(handList: number[], otherGroupList: number[][], magicCount: number, deep: number, getNumberRemaining: GetNumberRemainingType = null) {
        this.deep = deep
        this.handList = handList
        this.magicCount = magicCount
        this.otherGroupList = otherGroupList
        getNumberRemaining && (this.getNumberRemaining = getNumberRemaining)
        this.getOutCard()
    }

    private transferMagic(handList: number[], transferCount: number, start: number) {
        if (transferCount === 0) { return [handList] }
        const list: number[][] = []
        for (let i = start; i < handList.length; ++i) {
            if (handList[i] === handList[i - 1]) { continue }
            const subHandList = [...handList]
            subHandList.splice(i, 1)
            const res = this.transferMagic(subHandList, transferCount - 1, i)
            list.push(...res)
        }
        return list
    }

    protected getHuWeight(handList: number[]) {
        const data = new MahjongGroupBase(handList, this.handList.length - handList.length + this.magicCount, this.otherGroupList)
        data.init()
        const listenCard = data.getAllListenCard()
        const deeps = this.handList.length - handList.length
        let Weight = [...listenCard].reduce((w, item) => w + (1 + Math.sqrt(item[1])) * this.getNumberRemaining(item[0]), 0)
        Weight = Weight / Math.pow(1.8, deeps)
        return Weight
    }

    protected getOutCard() {
        const subList: number[][] = []
        const handList = this.handList.sort((a, b) => a - b)
        new Array(this.deep + 1).fill(0).forEach((_, i) => subList.push(...this.transferMagic(handList, i, 0)))
        for (const item of subList) {
            for (let q = 0; q < item.length; q++) {
                if (item[q] === item[q - 1]) { continue }
                const sub = [...item]
                const num = sub.splice(q, 1)[0]
                const weight = this.getHuWeight(sub)
                this.outCardWeightMap.has(num) || this.outCardWeightMap.set(num, 0)
                this.outCardWeightMap.set(num, this.outCardWeightMap.get(num) + weight)
            }
        }
    }

    public get() {
        let target = this.handList[0]
        let weight = 0
        for (const [num, w] of this.outCardWeightMap) {
            if (w > weight) {
                target = num
                weight = w
            }
        }
        return target
    }

}


// const transferMagic = (handList: number[], transferCount: number, start: number) => {
//     if (transferCount === 0) {
//         return [handList]
//     }
//     const list: number[][] = []
//     for (let i = start; i < handList.length; ++i) {
//         if (handList[i] === handList[i - 1]) { continue }
//         const subHandList = [...handList]
//         subHandList.splice(i, 1)
//         const res = transferMagic(subHandList, transferCount - 1, i)
//         list.push(...res)
//     }
//     return list
// }

// const getHuWeight = (handList: number[], otherGroupList: number[][], magicCount: number) => {
//     const data = new MahjongGroupBase(handList, magicCount + 1, otherGroupList)
//     data.init()
//     const listenCard = data.getAllListenCard()
//     return [...listenCard.values()].reduce((a, b) => a + b, 0)
// }

// const deep = 3
// export const getOutCard = (handList: number[], otherGroupList: number[][], magicCount: number) => {
//     handList = handList.sort((a, b) => a - b)
//     const m = new Map<number, number>()

//     for (let i = 0; i <= deep; i++) {
//         const subList = transferMagic(handList, i, 0)
//         for (const item of subList) {
//             for (let q = 0; q < item.length; q++) {
//                 if (item[q] === item[q - 1]) { continue }
//                 const sub = [...item]
//                 const num = sub.splice(q, 1)[0]
//                 const weight = getHuWeight(sub, otherGroupList, magicCount + i) / Math.pow(3.7, i)
//                 m.has(num) || m.set(num, 0)
//                 m.set(num, m.get(num) + weight)
//             }
//         }
//     }
//     return m
// }