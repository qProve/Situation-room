<script setup lang="ts">
import { createApp, onMounted, onUnmounted, ref, watch } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, Point } from 'geojson';
import MoleculeMapPopup from '../molecules/MoleculeMapPopup.vue';
import { colorManager } from '@/managers/categoryColor.manager.ts';

const props = withDefaults(
    defineProps<{
        center?: maplibregl.LngLatLike;
        zoom?: number;
        features: Feature[];
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
let popup: maplibregl.Popup | null = null;
let popupLngLat: [number, number] | null = null;

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
    popup?.remove();
    map?.remove();
});

watch([() => props.features, mapReady], ([features, ready]) => {
    if (!ready || !map) return;
    if (!colorManager.hasAssignments()) return;

    updateSource(features as Feature[]);
});

const updateSource = (features: Feature[]) => {
    const colorExpression = colorManager.buildExpression();
    const source = map?.getSource('features') as maplibregl.GeoJSONSource | undefined;

    if (source) {
        source.setData({ type: 'FeatureCollection', features });
        map?.setPaintProperty('features-circles', 'circle-color', colorExpression);
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

        addClickHandler();
    }
};

const createPopupContent = (properties: Record<string, unknown>) => {
    const container = document.createElement('div');

    createApp(MoleculeMapPopup, { properties }).mount(container);

    return container;
};

const addClickHandler = () => {
    map?.on('click', 'features-circles', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const coordinates = (feature.geometry as Point).coordinates as [number, number];
        const rounded: [number, number] = [
            Math.round(coordinates[0] * 1e6) / 1e6,
            Math.round(coordinates[1] * 1e6) / 1e6,
        ];

        const properties = feature.properties;

        popupLngLat = rounded;

        popup?.remove();
        popup = new maplibregl.Popup()
            .setLngLat(rounded)
            .setDOMContent(createPopupContent(properties))
            .addTo(map!);

        popup.on('close', () => {
            popupLngLat = null;
        });

        console.log(feature);
    });

    map?.on('move', () => {
        if (!popup || !popupLngLat) return;

        const visible = isPointVisible(popupLngLat);
        const el = popup.getElement();
        const pos = map!.project(popupLngLat);
        el.style.transform = `translate(${Math.round(pos.x)}px, ${Math.round(pos.y)}px)`;

        el.style.opacity = visible ? '1' : '0';
        el.style.pointerEvents = visible ? 'auto' : 'none';
    });

    map?.on('mouseover', 'features-circles', () => {
        if (map) map.getCanvas().style.cursor = 'pointer';
    });
    map?.on('mouseleave', 'features-circles', () => {
        if (map) map.getCanvas().style.cursor = '';
    });
};

const isPointVisible = (coordinates: [number, number]): boolean => {
    if (!map) return false;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const mapCenter = map.getCenter();

    const lat1 = toRad(mapCenter.lat);
    const lng1 = toRad(mapCenter.lng);
    const lat2 = toRad(coordinates[1]);
    const lng2 = toRad(coordinates[0]);

    const dotprod =
        Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

    return dotprod > 0;
};
</script>

<template>
    <div ref="mapContainer" class="h-full w-full bg-black"></div>
</template>
