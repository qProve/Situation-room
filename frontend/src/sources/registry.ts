import type { NormalizedFeature } from "@/types/normalized.type";
import type { Component } from "vue";

export interface SourceStore {
    isLoading: boolean
    error: string | null
    availableCategories: Map<string, string>
    selectedCategories: Map<string, string>
    filteredFeatures: NormalizedFeature[] | unknown[]
}

export interface SourceDefinition {
    id: string
    label: string
    useStore: () => SourceStore
    normalize: (feature: unknown) => NormalizedFeature
    controls?: Component
}