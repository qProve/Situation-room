import { eonetSource } from './eonet.source';
import { openskySource } from './opensky.source';
import type { SourceDefinition } from './registry';
import { trainstrackingSource } from './trainstracking.source';
import { usgsSource } from './usgs.source';

export type { SourceDefinition };

export const sourceRegistry: SourceDefinition[] = [
    eonetSource,
    usgsSource,
    openskySource,
    trainstrackingSource,
];
