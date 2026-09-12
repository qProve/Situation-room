import { useEonetStore } from "@/stores/eonet.store";
import type { SourceDefinition } from "./registry.ts";
import type { NormalizedFeature } from "@/types/normalized.type";
import type { EonetFeature } from "@/types/eonet.type";
import EonetControls from "./controls/EonetControls.vue";

export const eonetSource: SourceDefinition = {
    id: 'eonet',
    label: 'EONET',
    useStore: useEonetStore,
    normalize: (f: unknown): NormalizedFeature => {
        const feature = f as EonetFeature
        return {
            ...feature,
            properties: {
                id: feature.properties.id,
                title: feature.properties.title,
                category: feature.properties.categories[0]?.id ?? 'unknown',
                link: feature.properties.link,
                date: feature.properties.date,
                description: feature.properties.description,
                extra: {
                    magnitude: feature.properties.magnitudeValue
                        ? `${feature.properties.magnitudeValue} ${feature.properties.magnitudeUnit}`
                        : null,
                    closed: feature.properties.closed,
                },
            },
        }
    },
    controls: EonetControls,
};