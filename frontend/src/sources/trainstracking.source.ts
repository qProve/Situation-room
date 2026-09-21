import { useTrainstrackingStore } from '@/stores/trainstracking.store';
import type { SourceDefinition } from './registry';
import { faTrain } from '@fortawesome/free-solid-svg-icons';
import type { NormalizedFeature } from '@/types/normalized.type';
import type { TrainstrackingTrain } from '@/types/trainstracking.type';

export const trainstrackingSource: SourceDefinition = {
    id: 'trainstracking',
    label: 'TRAINSTRACKING',
    useStore: useTrainstrackingStore,
    layerConfig: {
        type: 'symbol',
        svgPath: faTrain.icon[4] as string,
        svgViewBox: `0 0 ${faTrain.icon[0]} ${faTrain.icon[1]}`,
    },
    normalize: (f: unknown): NormalizedFeature => {
        const train = f as TrainstrackingTrain;

        const country = (train.country[0]?.toUpperCase() + train.country.slice(1)).replaceAll(
            '-',
            ' ',
        );

        const normalizedDescription = `${train.trainCode}-${country}: ${train.from} -> ${train.to} | next: ${train.nextStation}`;

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [train.lat ?? 0, train.lng ?? 0],
            },
            properties: {
                id: train.id,
                title: train.name,
                category: train.status,
                categoryLabel: train.status,
                description: normalizedDescription,
                extra: {
                    delay: train.delay,
                    platform: train.platform,
                    scheduled_departure: train.scheduledDep,
                },
            },
        };
    },
};
