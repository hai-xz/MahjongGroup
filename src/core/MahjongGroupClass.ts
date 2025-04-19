import { GroupNumberType, MAGIC_NUMBER, NumberGroupClass, SolutionType } from './NumberGroupClass';

type ListenCardInfoType = { 
    groupInfo: SolutionType,
    usedMagicList: number[],
    listenNumberList: number[],
    mintanList: number[] 
}

export class MahjongGroupBase extends NumberGroupClass {

    public allowListenAllNumber: boolean = false
    public listenAllNumber: boolean = false
    public listenCardInfo: ListenCardInfoType[] = []
    public otherNumberGroup: GroupNumberType[] = []

    public constructor(numberList: number[], magicCount: number = 1, otherNumberGroup: number[][]) {
        super(numberList, magicCount)
        this.otherNumberGroup = otherNumberGroup
    }

    public init() {
        super.init()
        this.checkSpecialCardGroup()
        this.generateListenNumberInfo(this.solutionList)
        return this
    }

    protected getAllCard() {
        return [
            ...new Array(9).fill(0).map((_, i) => i + 1),
            ...new Array(9).fill(0).map((_, i) => i + 1 + 16),
            ...new Array(9).fill(0).map((_, i) => i + 1 + 32)
        ]
    }

    protected toTransformedGroup(numberList: GroupNumberType) {
        return numberList.map(num => this.isMagicNumber(num) ? NumberGroupClass.magicToNumberMap.get(num) : num)
    }

    protected takeChainNumber(targetNumber: number) {
        const i = targetNumber % 16
        const base = Math.floor(targetNumber / 16) * 16
        const [floor, ceil] = [base + Math.max(1, i - 2), base + Math.min(7, i)]
        return new Array(ceil - floor + 1).fill(floor).map((_, i) => [floor + i, floor + i + 1, floor + i + 2])
    }

    protected generateListenNumberInfo(solutionList: SolutionType[]) {
        for (const group of solutionList) {
            const usedMagicList = group.flat(2).filter(num => this.isMagicNumber(num))
            const listenNumberList = this.toTransformedGroup(usedMagicList)
            this.listenCardInfo.push({
                groupInfo: group,
                listenNumberList,
                usedMagicList,
                mintanList: this.mateMintan(group, listenNumberList, usedMagicList)
            })
        }
    }

    protected checkSpecialCardGroup(): void {
        const list = this.checkSevenDoubleHaveMagic(this.numberList, this.numberMap.get(MAGIC_NUMBER))
        list.length > 0 && this.listenCardInfo.push({
            groupInfo: [this.numberList],
            listenNumberList: list,
            usedMagicList: [],
            mintanList: [...this.mateMintan([this.numberList], list, []), 2 ** 3]
        })
    }

    protected mateMintan(group: SolutionType, _listenNumberList: number[], usedMagicList: number[]): number[] {
        const mintanList: number[] = []
        this.isPenpenhu(group) && mintanList.push(2 ** 0)
        this.isQinyise(usedMagicList) && mintanList.push(2 ** 1)
        this.isQuanquiren() && mintanList.push(2 ** 2)
        return mintanList
    }

    protected isQinyise(usedMagicList: number[]) {
        const color = Math.floor(this.numberList[0] / 16)
        const data = [this.numberList, this.toTransformedGroup(usedMagicList)].flat(2)
        return data.length === 14 && data.every(num => Math.floor(num / 16) === color)
    }

    protected isPenpenhu(group: SolutionType) {
        return [...group.map(item => this.toTransformedGroup(item)), ...this.otherNumberGroup].every(item => new Set(item).size === 1)
    }

    protected isQuanquiren() {
        return this.numberList.length + this.numberMap.get(MAGIC_NUMBER) === 1
    }

    /**
     * 获取这组牌所有能听的牌
     * @returns 键为能听的牌，值为听的番数
     */
    public getAllListenCard() {
        const listenInfoMap = new Map<number, number>()
        this.listenCardInfo.forEach(item => item.listenNumberList.forEach(num => {
            const fan = Math.max(2 ** item.mintanList.length, listenInfoMap.get(num) ?? 0)
            listenInfoMap.set(num, fan)
        }))
        return listenInfoMap
    }

    protected finalDfs(numberMap: Map<number, number>, alreadyTakeGroupList: GroupNumberType[]) {
        if (this.allowListenAllNumber) { return this.checkListenAllCard(numberMap, alreadyTakeGroupList) }
        const magicCount = numberMap.get(MAGIC_NUMBER)
        if (magicCount === 0) { return super.finalDfs(numberMap, alreadyTakeGroupList) }

        //代码运行到这里也就意味着除了魔法牌以外的所有牌都被使用
        //倘若多出来的魔法牌数量较多（大概大于5这样）那性能就会很差 又或者你可以把 allowListenAllNumber属性设置为 true
        //这样就会使用 listenAllNumber属性来标识是否能听所有牌（这么做的缺点是不会匹配大胡牌型）
        //需要以下逻辑的麻将玩法一般需要 有魔法牌的机制（比如红中麻将，鬼麻将这种）,同时又需要有大胡牌型的规则，并且有魔法牌参与的也算大胡牌型
        //下面的代码是尝试用剩余的魔法牌枚举所有组合
        const resultList: SolutionType[] = []
        const allRelateGroup: GroupNumberType[] = []
        this.getAllCard().forEach(num => {
            let groupList = this.getRelatedGroup(num, alreadyTakeGroupList).filter(group => Math.min(...group) === num)
            groupList = groupList.map(group => this.mixedMagicNumber(group, numberMap)).filter(item => item)
            allRelateGroup.push(...groupList)
        })

        const dfs = (groupList: GroupNumberType[], residueMagicCount: number, index: number, usedDoubleNumber: boolean) => {
            if (residueMagicCount >= 2) {
                for (let i = index; i < allRelateGroup.length; i++) {
                    const group = allRelateGroup[i]
                    if (group.length === 2) {
                        usedDoubleNumber || dfs([...groupList, group], residueMagicCount - group.length, i, true)
                    } else {
                        dfs([...groupList, group], residueMagicCount - group.length, i, usedDoubleNumber)
                    }
                }
            }
            residueMagicCount === 0 && usedDoubleNumber && resultList.push(groupList)
        }
        dfs([], magicCount, 0, !!alreadyTakeGroupList.find(item => item.length === 2))
        resultList.forEach(item => this.solutionList.push([...alreadyTakeGroupList, ...item]))
    }

    /**
     * 通过剩余的魔法牌的数量来判断是否能满足胡牌要求
     * @param numberMap 当前的手牌剩余情况，键为牌值，值为数量
     * @param alreadyTakeGroupList 已经拿出来的手牌分组
     */
    protected checkListenAllCard(numberMap: Map<number, number>, alreadyTakeGroupList: GroupNumberType[]) {
        const magicCount = numberMap.get(MAGIC_NUMBER)
        const usedDoubleNumber = !!alreadyTakeGroupList.find(item => item.length === 2)
        if (magicCount === 0) {
            usedDoubleNumber && this.solutionList.push(alreadyTakeGroupList)
        } else if (magicCount === 1) {
            return  // TODO: 不能组成牌型  不能满足胡牌要求
        } else if (magicCount === 2 || magicCount === 5) {
            usedDoubleNumber || (this.listenAllNumber = true)
        } else {
            this.listenAllNumber = true
        }
    }

    /**
     * 一个简易的七对牌型检测
     * @param numberList 手牌列表
     * @param magicCount 魔法牌数量
     * @returns 听牌列表
     */
    public checkSevenDoubleHaveMagic(numberList: number[], magicCount: number): number[] {
        if (numberList.length + magicCount !== 14) { return [] }
        const s = new Set<number>()
        numberList.forEach(num => s.has(num) ? s.delete(num) : s.add(num))
        if (s.size > magicCount) { return [] }
        if (s.size === magicCount) { return [...s] }
        return this.getAllCard()
    }

}

// /**
//  * 这个方法用来判断是否能组成七对牌型 checkSevenDoubleHaveMagic 方法的加强版本，可以检测(双/三)豪华七小对的情况（哪怕是有很多张魔法牌的情况）
//  * @param numberList 普通牌
//  * @param magicCount 魔法牌数量
//  * @returns  Map<number, number> 键为听的牌，值为有几个大对子,null表示不能组成七对牌型
//  */
// public checkSevenDoubleHaveMagicSuper(numberList: number[], magicCount: number) {
//     const numberCountMap = new Map<number, number>()
//     numberList.forEach(num => numberCountMap.set(num, (numberCountMap.get(num) ?? 0) + 1))
//     if (numberList.length + magicCount !== 14 || numberCountMap.size > 7) { return null }
//     const listenCardMap = new Map<number, number>()
//     const bigNumSet = new Set<number>()
//     let bigDoubleCount = 0
//     const miniDouble = new Set<number>()
//     const usedMagic = new Set<number>()
//     for (const [num, count] of numberCountMap) {
//         if (count % 2 === 1) {
//             magicCount--
//             usedMagic.add(num)
//         }
//         if (count > 2) {
//             bigDoubleCount++
//             count % 2 === 1 && bigNumSet.add(num)
//         } else {
//             miniDouble.add(num)
//         }
//     }
//     if (magicCount < 0) { return null }
//     if (magicCount === 0) {
//         usedMagic.forEach(n => listenCardMap.set(n, bigNumSet.has(n) ? 1 : 0))
//         return listenCardMap
//     }
//     const fn = (num: number, magicDoubleCount: number) => {
//         const y1 = Math.min(magicDoubleCount, miniDouble.size)
//         const y2 = Math.floor(Math.max(magicDoubleCount - miniDouble.size, 0) / 2)
//         listenCardMap.set(num, bigDoubleCount + y1 + y2)
//     }

//     const n = Math.floor(magicCount / 2)
//     miniDouble.forEach(num => fn(num, n))
//     bigNumSet.forEach(num => fn(num, n))
//     n > 0 && this.getAllCard().filter(num => !miniDouble.has(num)).filter(num => !bigNumSet.has(num)).forEach(num => fn(num, n - 1))
//     return listenCardMap
// }
