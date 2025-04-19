<script setup lang="ts">

import { ref } from 'vue';
import Describe from './components/Describe.vue';
import MjListenTest from './components/MjListenTest.vue';
import MjOutCardTest from './components/MjOutCardTest.vue';
import MahjongMoreTest from './components/MahjongMoreTest.vue';

const map = [Describe, MjListenTest, MjOutCardTest, MahjongMoreTest]
const selectedIndex = ref(0)

</script>

<template>
    <div class="nav">
        <ul>
            <li :class="selectedIndex === 0 ? 'selected' : ''" @click="() => selectedIndex = 0">介绍</li>
            <li :class="selectedIndex === 1 ? 'selected' : ''" @click="() => selectedIndex = 1">听牌测试</li>
            <li :class="selectedIndex === 2 ? 'selected' : ''" @click="() => selectedIndex = 2">出牌提示测试</li>
            <li :class="selectedIndex === 3 ? 'selected' : ''" @click="() => selectedIndex = 3">风牌箭牌听牌测试</li>
        </ul>
    </div>
    <div :class="selectedIndex !== 0 ? 'container' : 'container2'">
        <component :is="map[selectedIndex]" />
    </div>
</template>

<style scoped>
.nav {
    width: 12%;
    height: 100%;
    background-color: cadetblue;
    padding-top: 10rem;
    user-select: none;
}

.container {
    width: 88%;
    height: 100%;
    background-color: slategray;
    padding-left: 1rem;
    padding-top: 1rem;
}

.container2 {
    width: 88%;
    height: 100%;
    background-color: slategray;
    padding-left: 0;
    padding-top: 0;
}

.nav>ul {
    width: 100%;
    height: 100%;
}

.nav>ul>li {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
}

.selected {
    background-color: darkgreen;
}

.nav>ul>li:hover {
    background-color: darkgreen;
}
</style>