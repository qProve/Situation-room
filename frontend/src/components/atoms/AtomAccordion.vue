<script setup lang="ts">
import { ref } from 'vue';
import AtomSpinner from './AtomSpinner.vue';

const props = withDefaults(
    defineProps<{
        title: string;
        cursor?: 'cursor-pointer' | 'cursor-default';
        loading?: boolean;
        openByDef?: boolean;
    }>(),
    {
        cursor: 'cursor-pointer',
        openByDef: false,
    }
);

const isOpen = ref(props.openByDef);

const toggleAccordion = () => {
    if (!props.loading) isOpen.value = !isOpen.value;
}

const onEnter = (el: Element) => {
    const html = el as HTMLElement;
    html.style.height = '0';
    void html.offsetHeight;
    html.style.height = html.scrollHeight + 'px';
};

const onAfterEnter = (el: Element) => {
    (el as HTMLElement).style.height = 'auto';
};

const onLeave = (el: Element) => {
    const html = el as HTMLElement;
    html.style.height = html.scrollHeight + 'px';
    void html.offsetHeight;
    html.style.height = '0';
};

const onAfterLeave = (el: Element) => {
    (el as HTMLElement).style.height = 'auto';
};
</script>

<template>
    <div
        class="rounded-lg overflow-hidden"
        :class="[{'border-white/20': isOpen}]"
    >
        <button
            @click="toggleAccordion()"
            class="w-full px-2 py-3 text-left text-sm font-medium flex justify-between items-center text-white/60 hover:bg-white/5 transition-colors duration-150"
            :class="[cursor]"
        >
            <span>{{ title }}</span>
            <span>
                <i
                    v-if="!loading"
                    class="fa-solid fa-chevron-down text-white/40 transition-transform duration-200 text-xs"
                    :class="{ 'rotate-180': isOpen }"
                />

                <AtomSpinner
                    v-else
                    color="rgba(255,255,255,0.6)"
                    size="text-md"
                />
            </span>
        </button>
        
        <Transition 
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
        >
            <div v-if="isOpen" class="overflow-hidden transition-[height] duration-300 ease-in-out">
                <div class="border-t border-white/10" />
                <div class="px-3 pb-3 pt-2 text-sm text-white/60 leading-relaxed">
                    <slot />
                </div>
            </div>
        </Transition>
    </div>
</template>