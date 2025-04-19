<script setup lang="ts">
import { reactive, computed } from 'vue';
import MjSelected from './MjSelected.vue';
import { MahjongGroupBase } from '../core/MahjongGroupClass';
import { getIconNameById } from '../tools/tools';
import { MahjongMore } from '../core/MahjongMore';

const idList = [
    ...new Array(9).fill(0).map((_, index) => index + 1),
    ...new Array(9).fill(0).map((_, index) => index + 1 + 16),
    ...new Array(9).fill(0).map((_, index) => index + 1 + 32),
    ...new Array(4).fill(0).map((_, i) => i + 1 + 48),
    ...new Array(3).fill(0).map((_, i) => i + 1 + 64)
]

const addMj = (id: number) => {
    if (handCardList.length >= 14) { return }
    handCardList.push(id)
    handCardList.sort((a, b) => a - b)
}

const removeMj = (id: number) => handCardList.splice(handCardList.indexOf(id), 1)
const addMagic = (id: number) => magicSet.add(id)
const removeMagic = (id: number) => magicSet.delete(id)

const handCardList = reactive(new Array<number>())
const magicSet = reactive(new Set<number>())
const listenCardInfo = computed(() => {
    let magicCount = 0
    const h = handCardList.filter(id => {
        if (magicSet.has(id)) {
            magicCount++
            return false
        }
        return true
    })
    const target = new MahjongGroupBase(h, magicCount + 1, [])
    target.init()
    return target.getAllListenCard()
})

const listenCardList = computed(() => {
    const list = [...listenCardInfo.value.keys()]

    if (list.length > 0) {
        magicSet.forEach(id => {
            if (!listenCardInfo.value.has(id)) {
                list.push(id)
            }
        })
    }
    return list.sort((a, b) => a - b)
})

const canHu = computed(() => {
    let magicCount = 0
    const h = handCardList.filter(id => {
        if (magicSet.has(id)) {
            magicCount++
            return false
        }
        return true
    })
    const target = new MahjongMore(h, magicCount, [])
    target.init()
    return target.solutionList.length > 0
})

const mjGroup = computed(() => {
    const wan = idList.filter(id => id < 10)
    const ton = idList.filter(id => id < 32 && id > 16)
    const tiao = idList.filter(id => id > 32 && id < 48)
    const fen = idList.filter(id => id > 48 && id < 64)
    const jian = idList.filter(id => id > 64)
    return { wan, tiao, ton, fen, jian }
})

</script>

<template>
    <p>点击添加到手牌</p>
    <MjSelected :id-list="mjGroup.wan" :get-path-by-id-fn="getIconNameById" @touch="addMj" title="万" />
    <MjSelected :id-list="mjGroup.ton" :get-path-by-id-fn="getIconNameById" @touch="addMj" title="筒" />
    <MjSelected :id-list="mjGroup.tiao" :get-path-by-id-fn="getIconNameById" @touch="addMj" title="条" />
    <MjSelected :id-list="[...mjGroup.fen, ...mjGroup.jian]" :get-path-by-id-fn="getIconNameById" @touch="addMj"
        title="风箭" />

    <p>点击设置为魔法牌</p>
    <MjSelected :id-list="mjGroup.wan" :get-path-by-id-fn="getIconNameById" @touch="addMagic" title="万" />
    <MjSelected :id-list="mjGroup.ton" :get-path-by-id-fn="getIconNameById" @touch="addMagic" title="筒" />
    <MjSelected :id-list="mjGroup.tiao" :get-path-by-id-fn="getIconNameById" @touch="addMagic" title="条" />
    <MjSelected :id-list="[...mjGroup.fen, ...mjGroup.jian]" :get-path-by-id-fn="getIconNameById" @touch="addMagic"
        title="风箭" />

    <p>当前魔法牌(点击还原)</p>
    <MjSelected :id-list="[...magicSet]" :get-path-by-id-fn="getIconNameById" @touch="removeMagic" title="魔法牌" />

    <p>手牌{{ handCardList.length }}(点击移除){{ canHu ? '--当前手牌能直接胡牌' : '' }}</p>
    <MjSelected :id-list="handCardList" :get-path-by-id-fn="getIconNameById" @touch="removeMj" title="手牌" />

    <p>当前手牌听的牌(允许风牌箭牌组成顺子)</p>
    <MjSelected :id-list="listenCardList" :get-path-by-id-fn="getIconNameById" title="听牌" />

</template>

<style lang="css" scoped></style>