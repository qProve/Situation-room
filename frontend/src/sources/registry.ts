import type { NormalizedFeature } from '@/types/normalized.type';
import type { Component } from 'vue';

export interface SourceStore {
    isLoading: boolean;
    error: string | null;
    availableCategories: Map<string, string>;
    selectedCategories: Map<string, string>;
    filteredFeatures: NormalizedFeature[] | unknown[];
    fetch: () => Promise<void>;
}

export interface SourceDefinition {
    id: string;
    label: string;
    useStore: () => SourceStore;
    normalize: (feature: unknown) => NormalizedFeature;
    controls?: Component;
    layerConfig?: LayerConfig;
}

export type LayerConfig =
    | { type: 'circle' }
    | {
          type: 'symbol';
          svgPath: string;
          svgViewBox: string;
          iconSize?: number;
          rotateProperty?: string;
      };
