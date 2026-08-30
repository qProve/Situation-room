import type { Feature, Point, Polygon } from 'geojson';

export interface NormalizedProperties {
    id: string;
    title: string;
    category: string;
    link?: string;
    closed?: string | null;
    date?: string;
    magnitudeValue?: number | null;
    magnitudeUnit?: string | null;
    time?: number;
    mag?: number | null;
    place?: string;
}

export type NormalizedFeature = Feature<Point | Polygon, NormalizedProperties>;
