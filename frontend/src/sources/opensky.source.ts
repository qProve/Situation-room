import { useOpenskyStore } from '@/stores/opensky.store';
import type { SourceDefinition } from './registry';
import type { NormalizedFeature } from '@/types/normalized.type';
import type { OpenskyState } from '@/types/opensky.type';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

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
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [state.longtitude ?? 0, state.latitude ?? 0],
            },
            properties: {
                id: state.icao24,
                title: state.callsign?.trim() || state.icao24,
                category: String(state.category),
                date: new Date(state.last_contact * 1000).toISOString(),
                description: state.origin_country,
                heading: state.true_track,
                extra: {
                    altitude: state.baro_altitude,
                    velocity: state.velocity,
                    on_ground: state.on_ground,
                    squawk: state.squawk,
                },
            },
        };
    },
};
