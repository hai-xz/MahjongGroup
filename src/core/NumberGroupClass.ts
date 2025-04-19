export const MAGIC_NUMBER = -9

export type GroupNumberType = readonly number[]
export type SolutionType = readonly GroupNumberType[]

export class NumberGroupClass {

    private static n = MAGIC_NUMBER - 1
    private static createUniqueMagicNumber() { return --this.n }

    /**记录魔法数字的变换情况 */
    protected static magicToNumberMap = new Map<number, number>()

    /**
     * 记录魔法数字的变换情况
     * @param toNumber 让一个魔法数字成为这个数字
     * @returns 返回变成这个数字的魔法数字
     */
    protected static recordMagicTransform(toNumber: number) {
        const magicNumber = this.magicToNumberMap.get(toNumber) ?? this.createUniqueMagicNumber()
        this.magicToNumberMap.set(magicNumber, toNumber)
        this.magicToNumberMap.set(toNumber, magicNumber)
        return magicNumber
    }

    /**最后得到的合法分组，有值的话表示是一组合法分组，能进行胡牌 */
    public solutionList: SolutionType[] = []
    /**手牌列表 */
    public numberList: number[] = []
    /**执行过程中记录当前的手牌剩余情况，键为牌值，值为数量 */
    protected numberMap: Map<number, number> = new Map<number, number>()

    /**
     * @param numberList 手牌数字列表，不要包含魔法牌,魔法牌仅统计数量传给magicCount
     * @param magicCount 有几张魔法牌
     */
    public constructor(numberList: number[], magicCount: number) {
        this.numberList = numberList.sort((a, b) => a - b)
        numberList.forEach(num => this.numberMap.set(num, (this.numberMap.get(num) ?? 0) + 1))
        this.numberMap.set(MAGIC_NUMBER, magicCount)
    }

    /**进行计算 */
    public init() {
        this.dfs(this.numberMap)
        return this
    }

    /**
     * 收尾函数，当所有牌都用完即能进行胡牌，记录分组方式
     * @param numberMap 当前的手牌剩余情况，键为牌值，值为数量
     * @param alreadyTakeGroupList 拿出来的手牌分组
     */
    protected finalDfs(numberMap: Map<number, number>, alreadyTakeGroupList: GroupNumberType[]) {
        numberMap.get(MAGIC_NUMBER) === 0 && alreadyTakeGroupList.find(item => item.length === 2) && this.solutionList.push(alreadyTakeGroupList)
    }

    /**
     * 进行递归，尝试对手牌进行分组
     * @param numberMap 当前的手牌剩余情况，键为牌值，值为数量
     * @param alreadyTakeGroupList 已经拿出来的手牌分组
     */
    protected dfs(numberMap: Map<number, number>, alreadyTakeGroupList: GroupNumberType[] = []) {
        const minKey = this.getNextNumber(numberMap)
        if (minKey === null || minKey === MAGIC_NUMBER) { return this.finalDfs(numberMap, alreadyTakeGroupList) }
        const groupNumberList = this.getRelatedGroup(minKey, alreadyTakeGroupList).map(numberGroup => this.mixedMagicNumber(numberGroup, numberMap)).filter(item => item)
        for (const groupNumber of groupNumberList) {
            this.changeNumberMap(numberMap, this.toNormalMagic(groupNumber), false)
            this.dfs(numberMap, [...alreadyTakeGroupList, groupNumber])
            this.changeNumberMap(numberMap, this.toNormalMagic(groupNumber), true)
        }
    }

    /**
     * 判断剩余手牌能否满足指定的分组，不能的话就使用魔法牌替代，魔法牌不够的话返回null
     * 返回 null 即不满足，这个时候会进行剪枝
     * @param numberGroup 要满足的分组
     * @param numberMap 当前的手牌剩余情况，键为牌值，值为数量
     * @returns 返回根据 numberGroup 生成的 numberList，无法满足的话为 null
     */
    protected mixedMagicNumber(numberGroup: GroupNumberType, numberMap: Map<number, number>) {
        const numberList: number[] = []
        const result = numberGroup.every(num => {
            if (numberMap.get(num) > 0) {
                numberMap.set(num, numberMap.get(num) - 1)
                numberList.push(num)
                return true
            } else if (numberMap.get(MAGIC_NUMBER) > 0) {
                const magicNumber = NumberGroupClass.recordMagicTransform(num)
                numberMap.set(MAGIC_NUMBER, numberMap.get(MAGIC_NUMBER) - 1)
                numberList.push(magicNumber)
                return true
            }
            return false
        })
        this.changeNumberMap(numberMap, this.toNormalMagic(numberList), true)
        return result ? numberList : null
    }

    /**
     * 获取能包含 targetNumber 的全部分组，比如 targetNumber = 2，那么返回值大概是 [[2,2],[2,2,2],[2,2,2,2],[1,2,3],[2,3,4]]
     * @param targetNumber 指定数字
     * @param alreadyTakeGroupList 之前已经拿出来的分组
     * @returns 包含 targetNumber 的全部分组
     */
    protected getRelatedGroup(targetNumber: number, alreadyTakeGroupList: GroupNumberType[]) {
        const beginCount = alreadyTakeGroupList.find(item => item.length === 2) ? 3 : 2
        return [...this.takeSameNumber(targetNumber, beginCount, 4), ...this.takeChainNumber(targetNumber)]
    }

    /**
     * 获取仅由 targetNumber 组成的分组
     * @param targetNumber 指定的数字
     * @param minCount    最小数量
     * @param maxCount    最大数量
     * @returns 二维数组，里面的元素均为 (targetNumber 组成的分组)
     */
    protected takeSameNumber(targetNumber: number, minCount: number, maxCount: number): GroupNumberType[] {
        return new Array(maxCount - minCount + 1).fill(minCount).map((_, i) => new Array(i + minCount).fill(targetNumber))
    }

    /**
     * 获取包含 targetNumber 组成的顺子
     * @param targetNumber 指定的数字
     * @returns 二维数组，里面的元素均为 (包含 targetNumber 组成的顺子)
     */
    protected takeChainNumber(targetNumber: number): GroupNumberType[] {
        const [floor, ceil] = [targetNumber - 2, targetNumber]
        return new Array(ceil - floor + 1).fill(floor).map((_, i) => [floor + i, floor + i + 1, floor + i + 2])
    }

    /**
     * 获取当前剩余的牌中，非魔法牌的最小的数字 (numberMap的键在添加前进行了排序，相关逻辑看构造函数)
     * @param numberMap 当前的手牌剩余情况，键为牌值，值为数量
     * @returns 牌值
     */
    protected getNextNumber(numberMap: Map<number, number>) {
        return [...numberMap.keys()].find(n => numberMap.get(n) > 0) ?? MAGIC_NUMBER
    }

    /**判断是否为魔法数字 */
    protected isMagicNumber(num: number) {
        return num <= MAGIC_NUMBER
    }

    /**
     * 修改当前的手牌剩余情况
     * @param numberMap 当前的手牌剩余情况
     * @param numberList 拿出或者恢复的手牌列表
     * @param isRestore 是恢复还是取出
     */
    protected changeNumberMap(numberMap: Map<number, number>, numberList: GroupNumberType, isRestore: boolean) {
        const change = isRestore ? 1 : -1
        numberList.forEach(num => numberMap.set(num, (numberMap.get(num) ?? 0) + change))
    }

    /** 
     * 把一个分组里面的魔法牌数字转换为标准的魔法数字 MAGIC_NUMBER [-10,-11,3] => [MAGIC_NUMBER,MAGIC_NUMBER,3]
     * @param numberList 数字列表
     * @returns 被转换后的数字列表
     */
    protected toNormalMagic(numberList: GroupNumberType) {
        return numberList.map(num => this.isMagicNumber(num) ? MAGIC_NUMBER : num)
    }

}