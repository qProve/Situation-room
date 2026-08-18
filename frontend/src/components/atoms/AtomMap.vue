<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, FeatureCollection } from 'geojson';
import { buildColorExpression } from '@/utils/categoryColors';

const props = withDefaults(
    defineProps<{
        center?: maplibregl.LngLatLike;
        zoom?: number;
        features?: Feature[];
    }>(),
    {
        center: () => [0, 0],
        zoom: 2.5,
        features: () => [],
    },
);

const mapContainer = ref<HTMLElement | null>(null);
let map: maplibregl.Map | null = null;
const mapReady = ref(false);

onMounted(() => {
    if (mapContainer.value) {
        map = new maplibregl.Map({
            container: mapContainer.value,
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: props.center,
            zoom: props.zoom,
            attributionControl: false,
        } as maplibregl.MapOptions);

        map.on('load', () => {
            map?.setProjection({ type: 'globe' });
            mapReady.value = true;
        });
    }
});

onUnmounted(() => {
    map?.remove();
});

const updateSource = (features: Feature[]) => {
    const categories = [...new Set(features.map((f) => f.properties?.category).filter(Boolean))];

    const colorExpression = buildColorExpression(categories);

    const source = map?.getSource('features') as maplibregl.GeoJSONSource | undefined;

    if (source) {
        source.setData({ type: 'FeatureCollection', features });

        if (map?.getLayer('features-circles')) {
            map?.setPaintProperty('features-circles', 'circle-color', colorExpression);
        }
    } else {
        map?.addSource('features', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features },
        });

        map?.addLayer({
            id: 'features-circles',
            type: 'circle',
            source: 'features',
            paint: {
                'circle-radius': 6,
                'circle-color': colorExpression,
                'circle-opacity': 0.8,
            },
        });
    }
};

watch([() => props.features, mapReady], ([features, ready]) => {
    if (!ready || !map) return;

    updateSource(features as Feature[]);
});
</script>

<template>
    <div ref="mapContainer" class="h-screen w-screen bg-black"></div>
</template>
