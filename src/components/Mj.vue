<script setup lang="ts">

defineProps<{
    path: string,
}>()

const emit = defineEmits<{
    (e: 'touch'): void
}>()


</script>

<template>
    <img :src="path" @mousedown="() => emit('touch')" />
</template>

<style lang="css" scoped>
img {
    width: 3rem;
    height: 4rem;
    user-select: none;
    -webkit-user-drag: none;
    box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.5);
}

img:hover {
    filter: brightness(60%);
}
</style>