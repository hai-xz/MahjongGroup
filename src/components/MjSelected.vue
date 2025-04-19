<script setup lang="ts">
import Mj from './Mj.vue';

defineProps<{
    title: string,
    idList: number[],
    getPathByIdFn: (id: number) => string,
}>()

const emit = defineEmits<{
    (e: 'touch', id: number): void
}>()


</script>

<template>

    <div class="MjSelected">
        <p> {{ title }} </p>
        <div>
            <Mj v-for="id in idList" :key="id" :path="getPathByIdFn(id)" @touch="emit('touch', id)" />
        </div>
    </div>


</template>

<style scoped>
.MjSelected {
    width: 80rem;
    display: flex;
    overflow: visible;
}

.MjSelected>p {
    width: 5rem;
    height: 4.1rem;
    line-height: 4rem;
    border: 1px solid #000;
    text-align: center;
    user-select: none;
}

.MjSelected>div {
    width: 75rem;
    border: 1px #000;
}
</style>