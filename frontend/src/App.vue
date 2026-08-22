<script setup lang="ts">
import OrganismBottomPanel from './components/organisms/OrganismBottomPanel.vue';
import OrganismMap from './components/organisms/OrganismMap.vue';
</script>

<template>
    <div class="h-screen flex flex-col">
        <OrganismMap class="flex-1 overflow-hidden" />

        <OrganismBottomPanel class="h-7.5" />
    </div>

    <RouterView />
</template>
