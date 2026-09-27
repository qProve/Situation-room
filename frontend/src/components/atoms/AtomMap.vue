<script setup lang="ts">
import { createApp, onMounted, onUnmounted, ref, watch } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, Point } from 'geojson';
import MoleculeMapPopup from '../molecules/MoleculeMapPopup.vue';
import { colorManager } from '@/managers/categoryColor.manager.ts';
import type { SourceDefinition } from '@/sources/registry.ts';
import { createIconImage } from '@/utils/iconCanvas.ts';

const props = withDefaults(
    defineProps<{
        center?: maplibregl.LngLatLike;
        zoom?: number;
        sources: { source: SourceDefinition; features: Feature[] }[];
    }>(),
    {
        center: () => [0, 0],
        zoom: 2.5,
        sources: () => [],
    },
);

const mapContainer = ref<HTMLElement | null>(null);
let map: maplibregl.Map | null = null;
const mapReady = ref(false);
let popup: maplibregl.Popup | null = null;
let popupLngLat: [number, number] | null = null;

const registeredCategories = new Map<string, string[]>();
const registeredIcons = new Set<string>();
const addingLayers = new Set<string>();

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

watch([() => props.sources, mapReady], ([sources, ready]) => {
    if (!ready || !map) return;
    if (!colorManager.hasAssignments()) return;

    for (const { source, features } of sources) {
        updateSource(source, features);
    }
});

const updateSource = async (sourceDef: SourceDefinition, features: Feature[]) => {
    const sourceId = sourceDef.id;
    const layerId = `${sourceId}-layer`;
    const layerConfig = sourceDef.layerConfig ?? { type: 'circle' };

    const existingSource = map?.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
    const existingLayer = map?.getLayer(layerId);

    if (existingSource) {
        existingSource.setData({ type: 'FeatureCollection', features });

        if (layerConfig.type === 'circle') {
            if (existingLayer) {
                map?.setPaintProperty(layerId, 'circle-color', colorManager.buildExpression());
            }
        } else if (layerConfig.type === 'symbol' && features.length > 0) {
            await registerCategoryIcons(sourceId, features, layerConfig);

            console.log(sourceId);

            if (existingLayer) {
                map?.setLayoutProperty(
                    layerId,
                    'icon-image',
                    colorManager.buildIconExpression(
                        sourceId,
                        registeredCategories.get(sourceId) ?? [],
                    ),
                );
            } else if (!addingLayers.has(layerId)) {
                addingLayers.add(layerId);
                map?.addLayer({
                    id: layerId,
                    type: 'symbol',
                    source: sourceId,
                    layout: {
                        'icon-image': colorManager.buildIconExpression(
                            sourceId,
                            registeredCategories.get(sourceId) ?? [],
                        ),
                        'icon-size': 0.15,
                        'icon-allow-overlap': true,
                        'icon-rotate': layerConfig.rotateProperty
                            ? ['get', layerConfig.rotateProperty]
                            : 0,
                        'icon-rotation-alignment': 'map',
                    },
                });

                addClickHandler(layerId);
            }
        }
    } else {
        if (features.length === 0) return;

        map?.addSource(sourceId, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features },
        });

        if (layerConfig.type === 'circle') {
            map?.addLayer({
                id: layerId,
                type: 'circle',
                source: sourceId,
                paint: {
                    'circle-radius': 6,
                    'circle-color': colorManager.buildExpression(),
                    'circle-opacity': 0.8,
                },
            });

            addClickHandler(layerId);
        } else if (layerConfig.type === 'symbol' && !addingLayers.has(layerId)) {
            addingLayers.add(layerId);
            await registerCategoryIcons(sourceId, features, layerConfig);

            map?.addLayer({
                id: layerId,
                type: 'symbol',
                source: sourceId,
                layout: {
                    'icon-image': colorManager.buildIconExpression(
                        sourceId,
                        registeredCategories.get(sourceId) ?? [],
                    ),
                    'icon-size': 0.15,
                    'icon-allow-overlap': true,
                    'icon-rotate': layerConfig.rotateProperty
                        ? ['get', layerConfig.rotateProperty]
                        : 0,
                    'icon-rotation-alignment': 'map',
                },
            });

            addClickHandler(layerId);
        }
    }
};

const createPopupContent = (properties: Record<string, unknown>) => {
    const container = document.createElement('div');

    createApp(MoleculeMapPopup, { properties }).mount(container);

    return container;
};

const addClickHandler = (layerId: string) => {
    map?.on('click', layerId, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const coordinates = (feature.geometry as Point).coordinates as [number, number];
        const rounded: [number, number] = [
            Math.round(coordinates[0] * 1e6) / 1e6,
            Math.round(coordinates[1] * 1e6) / 1e6,
        ];

        popupLngLat = rounded;
        popup?.remove();
        popup = new maplibregl.Popup()
            .setLngLat(rounded)
            .setDOMContent(createPopupContent(feature.properties))
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

    map?.on('mouseover', layerId, () => {
        if (map) map.getCanvas().style.cursor = 'pointer';
    });
    map?.on('mouseleave', layerId, () => {
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

const registerCategoryIcons = async (
    sourceId: string,
    features: Feature[],
    layerConfig: Extract<import('@/sources/registry').LayerConfig, { type: 'symbol' }>,
) => {
    const categories = [...new Set(features.map((f) => f.properties?.category as string))].filter(
        (c) => c && c !== 'undefined',
    );

    registeredCategories.set(sourceId, categories);

    for (const categoryId of categories) {
        const key = `${sourceId}-${categoryId}`;
        if (map?.hasImage(key) || registeredIcons.has(key)) continue;
        registeredIcons.add(key);

        const color = colorManager.getColor(categoryId);
        const imageData = await createIconImage(
            layerConfig.svgPath,
            layerConfig.svgViewBox,
            color,
            128,
        );

        try {
            map?.addImage(key, imageData);
        } catch {}
    }
};
</script>

<template>
    <div ref="mapContainer" class="h-full w-full bg-black"></div>
</template>
