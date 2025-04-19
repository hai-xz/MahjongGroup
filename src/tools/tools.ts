export const getIconNameById = (id: number) => {
    let path = ''
    if (id > 0 && id <= 15) {
        path = `1 (${id}).png`          //万
    } else if (id >= 16 && id <= 31) {
        path = `1 (${id - 7}).png`      //筒
    } else if (id >= 32 && id <= 47) {
        path = `1 (${id - 14}).png`     //条
    } else if (id >= 48 && id <= 63) {
        path = `1 (${id - 21}).png`     //风
    } else if (id >= 64 && id <= 79) {
        path = `1 (${id - 33}).png`     //剑
    }
    return `/src/assets/icon/` + path
}









// // const p = MajhongGetOutWeight([1, 1, 4, 5, 7, 18, 19, 35], [], 0)
// // console.log(p)

// import { MajhongGetOutWeight } from "../core/MajhongGetOutWeight"
// import { MahjongGroupBase } from "../core/MajhongGroupClass"

// // const p = new MajhongGetOutWeight([2, 2, 5, 6, 7, 17, 17, 21, 33, 34, 36], [], 0, 2)
// const p = new MajhongGetOutWeight([2, 3, 3, 9, 17, 17, 22, 22, 22, 35, 35, 39, 40, 41], [], 0, 2)
// console.log(p)


// const p3 = new MahjongGroupBase([2, 3, 3, 17, 17, 22, 22, 22, 35, 35, 39, 40, 41], 1, [])


// // const p = new NumberGroupClass([1, 1, 2], 2)
// // p.init()
// // console.log(p.solutionList, p)

// // let count = 0

// // const fn = () => {
// //     const allCard: number[] = MahjongGroupBase.getAllCard().map(num => new Array(4).fill(num)).flat().sort(() => Math.random() - 0.5)
// //     const p2 = new MahjongGroupBase(allCard.splice(0, Math.random() * 14 | 0), [], 1)
// //     p2.init()
// //     if (p2.solutionList.length > 0) {
// //         validation(p2)
// //     }
// //     count++
// //     if (count % 1000 === 0) {
// //         console.log(count, performance.now())
// //     }
// // }
// // const fn = () => {
// //     const allCard: number[] = MahjongGroupBase.getAllCard().map(num => new Array(4).fill(num)).flat().sort(() => Math.random() - 0.5)
// //     const p2 = new MahjongGroupBase(allCard.splice(0, Math.random() * 14 | 0), 1, [])
// //     p2.init()
// //     if (p2.solutionList.length > 0) {
// //         validation(p2)
// //     }
// //     count++
// //     if (count % 1000 === 0) {
// //         console.log(count, performance.now())
// //     }
// // }



// const validation = (target: MahjongGroupBase) => {
//     const solutionList = target.solutionList
//     for (const solution of solutionList) {
//         const check1 = solution.filter(item => item.length === 2).length === 1
//         const check2 = solution.every(group => {
//             const normalGroup = target['toTransformedGroup'](group)
//             normalGroup.sort((a, b) => a - b)
//             const count = normalGroup.reduce((pv, cv) => pv + cv, 0)
//             return count / normalGroup.length === normalGroup[1]
//         })

//         const check3 = solution.every(group => {
//             const normalGroup = target['toTransformedGroup'](group)
//             normalGroup.sort((a, b) => a - b)
//             const allRelatedGroupIdList = target['getRelatedGroup'](normalGroup[0], []).map(item => [...item].sort((a, b) => a - b).join('_'))
//             return new Set(allRelatedGroupIdList).has(normalGroup.join('_'))
//         })

//         if (!(check1 && check2 && check3)) {
//             return console.error(target, [check1, check2, check3])
//         }
//     }
// }


// // const i = setInterval(() => {
// //     fn()
// //     fn()
// //     fn()
// // }, 0)

// // const p = MahjongGroupBase.checkSevenDoubleHaveMagic([1,2,3,4],10)
// // console.log(p)
// // const p = new HZMajhong([], [], 2)
// // p.init()
// // console.log(p,p.getAllListenCard())
// // const i = setInterval(() => {
// //     // fn()
// //     // fn()
// //     // fn()
// // }, 0)


// const p2 = new MahjongGroupBase([1, 1, 6, 7, 6, 7, 8, 8, 3, 3, 4, 4, 5], 1, [])
// p2.init()
// // const can: boolean = new MahjongGroupBase([1, 1, 4, 5], 1, []).init().solutionList.length > 0
// console.log(p2)



// const fn1 = () => {
//     return [
//         ...new Array(9).fill(0).map((_, i) => i + 1),
//         ...new Array(9).fill(0).map((_, i) => i + 1 + 16),
//         ...new Array(9).fill(0).map((_, i) => i + 1 + 32)
//     ]
// }

// const fn2 = (numberList: number[]) => {
//     const p = new MahjongGroupBase(numberList, 0, [])
//     p.init()
//     return p.solutionList.length > 0
// }

// const recordI: number[] = []

// const list = [
//     [4, 18, 25, 1, 22, 6, 3, 4, 9, 1, 39, 5, 41, 25, 37, 36, 37, 5, 21, 19, 2, 18, 33, 20, 40, 41, 34, 17, 20, 41, 39, 2, 5, 19, 19, 3, 2, 24, 35, 35, 23, 22, 38, 25, 23, 21, 3, 7, 8, 4, 34, 2, 1, 6, 36, 22, 17, 5, 3, 7, 34, 8, 9, 18, 7, 8, 34, 23, 24, 24, 23, 9, 37, 22, 17, 33, 20, 40, 9, 21, 6, 17, 38, 35, 8, 25, 1, 40, 33, 19, 33, 39, 40, 37, 41, 35, 38, 6, 39, 20, 36, 36, 24, 4, 7, 18, 38, 21],
//     [9, 8, 40, 4, 41, 19, 36, 5, 9, 8, 6, 17, 34, 41, 34, 33, 36, 25, 3, 1, 2, 23, 2, 3, 22, 24, 20, 5, 40, 22, 19, 37, 25, 7, 4, 21, 33, 35, 38, 18, 7, 7, 39, 3, 2, 7, 35, 20, 4, 23, 21, 41, 35, 21, 36, 40, 24, 33, 22, 24, 38, 21, 37, 37, 39, 39, 18, 23, 8, 17, 3, 38, 1, 35, 6, 38, 5, 2, 1, 36, 33, 20, 25, 6, 9, 25, 5, 34, 40, 6, 17, 19, 9, 8, 24, 4, 22, 37, 41, 39, 20, 19, 1, 17, 18, 23, 34, 18],
//     [2, 2, 25, 8, 37, 40, 24, 36, 4, 7, 40, 25, 36, 33, 7, 9, 34, 33, 2, 40, 18, 35, 35, 8, 18, 40, 41, 1, 36, 19, 21, 8, 4, 17, 21, 37, 5, 34, 6, 34, 9, 1, 41, 38, 34, 1, 22, 24, 17, 25, 6, 3, 22, 22, 20, 41, 1, 23, 19, 18, 24, 38, 8, 23, 5, 35, 38, 33, 19, 20, 3, 9, 39, 39, 17, 6, 4, 24, 25, 21, 22, 37, 6, 3, 33, 17, 4, 7, 21, 5, 18, 5, 23, 20, 7, 3, 20, 9, 37, 35, 39, 38, 2, 36, 19, 41, 23, 39]
// ]


// const fn3 = () => {
//     const allCard = list.pop()
//     const handList = allCard.splice(0, 14)
//     let i = 0

//     while (allCard.length > 0) {
//         // handList.sort((a, b) => a - b)
//         if (fn2(handList)) {
//             console.log('共抓牌次数:', i)
//             console.log('胡牌', handList)
//             recordI.push(i)
//             break
//         }

//         const target = new MajhongGetOutWeight(handList, [], 0, 2).get()

//         console.log([...handList], '出：', target)

//         handList.splice(handList.indexOf(target), 1)
//         i++
//         console.log([...handList], '抓牌：', allCard.at(-1))

//         handList.push(allCard.pop())

//     }

// }

// // while (list.length) {
// //     fn3()
// // }
// // console.log(recordI, recordI.reduce((a, b) => a + b, 0))


// const target = new MajhongGetOutWeight([1, 1, 3, 4, 4, 5, 6, 9, 18, 22, 25, 25, 39, 9], [], 0, 2)

// console.log(target, target.get())

// // <script setup lang="ts">

// // import Mj from './components/Mj.vue'

// // const getIconNameById = (id: number) => {
// //     let path = ''
// //     if (id > 0 && id <= 15) {
// //         path = `1 (${id}).png`          //万
// //     } else if (id >= 16 && id <= 31) {
// //         path = `1 (${id - 6}).png`      //筒
// //     } else if (id >= 32 && id <= 47) {
// //         path = `1 (${id - 13}).png`     //条
// //     } else if (id >= 48 && id <= 63) {
// //         path = `1 (${id - 20}).png`     //风
// //     } else if (id >= 64 && id <= 79) {
// //         path = `1 (${id - 32}).png`     //剑
// //     }
// //     return `/src/assets/icon/` + path
// // }


// // const idList = [
// //     ...new Array(9).fill(0).map((_, index) => index + 1),
// //     ...new Array(9).fill(0).map((_, index) => index + 16),
// //     ...new Array(9).fill(0).map((_, index) => index + 32),
// //     ...new Array(4).fill(0).map((_, index) => index + 48),
// //     ...new Array(3).fill(0).map((_, index) => index + 64),
// // ]

// // const onClickMj = (id: number) => {
// //     console.log(id)
// // }

// // </script>

// // <template>
// //     <Mj v-for="id in idList" :key="id" :path="getIconNameById(id)" @touch="() => onClickMj(id)"></Mj>
// // </template>
