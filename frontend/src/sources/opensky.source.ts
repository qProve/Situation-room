import { useOpenskyStore } from '@/stores/opensky.store';
import type { SourceDefinition } from './registry';
import type { NormalizedFeature } from '@/types/normalized.type';
import type { OpenskyState } from '@/types/opensky.type';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { OpenskyStateCategoryMap } from '@/types/opensky.type';

export const openskySource: SourceDefinition = {
    id: 'opensky',
    label: 'OPENSKY',
    useStore: useOpenskyStore,
    layerConfig: {
        type: 'symbol',
        svgPath: faPlane.icon[4] as string,
        svgViewBox: `0 0 ${faPlane.icon[0]} ${faPlane.icon[1]}`,
        rotateProperty: 'heading',
    },
    normalize: (f: unknown): NormalizedFeature => {
        const state = f as OpenskyState;

        const rawCategory = state[17] ?? 0;
        const normalizedCategory = rawCategory === 1 ? 0 : rawCategory;

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [state[5] ?? 0, state[6] ?? 0],
            },
            properties: {
                id: state[0],
                title: state[1]?.trim() || state[0],
                category: String(normalizedCategory),
                categoryLabel: OpenskyStateCategoryMap[normalizedCategory] ?? 'No information',
                date: new Date(state[4] * 1000).toISOString(),
                description: 'Originated from ' + state[2],
                heading: state[10],
                extra: {
                    altitude: state[7],
                    velocity: state[9],
                    on_ground: state[8],
                    squawk: state[14],
                },
            },
        };
    },
};
