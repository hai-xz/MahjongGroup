<script setup lang="ts">
import { reactive, computed } from 'vue';
import MjSelected from './MjSelected.vue';
import { MajhongGetOutWeight } from '../core/MahjongGetOutWeight';
import { getIconNameById } from '../tools/tools';

const idList = [
    ...new Array(9).fill(0).map((_, index) => index + 1),
    ...new Array(9).fill(0).map((_, index) => index + 1 + 16),
    ...new Array(9).fill(0).map((_, index) => index + 1 + 32)
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

const outCardList = computed(() => {
    if (handCardList.length % 3 !== 2) { return [] }
    let magicCount = 0
    const h = handCardList.filter(id => {
        if (magicSet.has(id)) {
            magicCount++
            return false
        }
        return true
    })

    const target = new MajhongGetOutWeight(h, [], magicCount, 2)
    return [...target.outCardWeightMap.keys()].sort((a, b) => {
        return target.outCardWeightMap.get(b) - target.outCardWeightMap.get(a)
    }).filter(id => target.outCardWeightMap.get(id) > 0)
})


const mjGroup = computed(() => {
    const wan = idList.filter(id => id < 10)
    const ton = idList.filter(id => id < 32 && id > 16)
    const tiao = idList.filter(id => id > 32)
    return { wan, tiao, ton }
})


</script>

<template>
    <p>点击添加到手牌</p>
    <MjSelected :id-list="mjGroup.wan" :get-path-by-id-fn="getIconNameById" @touch="addMj" title="万" />
    <MjSelected :id-list="mjGroup.ton" :get-path-by-id-fn="getIconNameById" @touch="addMj" title="筒" />
    <MjSelected :id-list="mjGroup.tiao" :get-path-by-id-fn="getIconNameById" @touch="addMj" title="条" />

    <p>点击设置为魔法牌</p>
    <MjSelected :id-list="mjGroup.wan" :get-path-by-id-fn="getIconNameById" @touch="addMagic" title="万" />
    <MjSelected :id-list="mjGroup.ton" :get-path-by-id-fn="getIconNameById" @touch="addMagic" title="筒" />
    <MjSelected :id-list="mjGroup.tiao" :get-path-by-id-fn="getIconNameById" @touch="addMagic" title="条" />
    <p>当前魔法牌(点击还原)</p>
    <MjSelected :id-list="[...magicSet]" :get-path-by-id-fn="getIconNameById" @touch="removeMagic" title="魔法牌" />

    <p>手牌{{ handCardList.length }}(点击移除)</p>
    <MjSelected :id-list="handCardList" :get-path-by-id-fn="getIconNameById" @touch="removeMj" title="手牌" />

    <p>推荐打出的牌(越靠左优先级越高)</p>
    <MjSelected :id-list="outCardList" :get-path-by-id-fn="getIconNameById" title="推荐出牌" />

</template>

<style></style>
