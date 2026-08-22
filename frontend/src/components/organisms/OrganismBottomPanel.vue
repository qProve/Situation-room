<script setup lang="ts">
import AtomButton from '../atoms/AtomButton.vue';

const handleClick = () => {
    console.log("AAAAAAAAA");
};
</script>

<template>
    <div class="relative px-2 py-1 flex bg-gray-600">
        <AtomButton
            label="Settings"
            size="h-6"
            v-on:click="handleClick"
            is-icon
            icon="fa-gear"
            color="text-gray-300"
            clickAnimation="scale"
        />
    </div>
</template>