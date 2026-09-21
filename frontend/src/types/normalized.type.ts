import type { Feature, Point, Polygon } from 'geojson';

export interface NormalizedProperties {
    id: string;
    title: string;
    category: string;
    categoryLabel?: string;
    date?: string;
    link?: string;
    description?: string | null;
    heading?: number | null;
    extra?: Record<string, unknown>;
}

export type NormalizedFeature = Feature<Point | Polygon, NormalizedProperties>;
