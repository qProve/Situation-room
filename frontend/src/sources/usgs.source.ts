import { useUsgsStore } from '@/stores/usgs.store';
import type { SourceDefinition } from './registry';
import type { NormalizedFeature } from '@/types/normalized.type';
import type { UsgsFeature } from '@/types/usgs.type';

export const usgsSource: SourceDefinition = {
    id: 'usgs',
    label: 'USGS',
    useStore: useUsgsStore,
    normalize: (f: unknown): NormalizedFeature => {
        const feature = f as UsgsFeature;
        return {
            ...feature,
            properties: {
                id: feature.id as string,
                title: feature.properties.title,
                category: feature.properties.type ?? 'unknown',
                link: feature.properties.url,
                date: new Date(feature.properties.time).toISOString(),
                description: feature.properties.place,
                extra: {
                    magnitude: feature.properties.mag,
                    alert: feature.properties.alert,
                    felt: feature.properties.felt,
                },
            },
        };
    },
};
