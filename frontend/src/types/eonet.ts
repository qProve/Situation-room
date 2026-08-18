import type { Feature, Point, Polygon } from 'geojson';

export interface EonetCategory {
    id: string;
    title: string;
}

export interface EonetSource {
    id: string;
    url: string;
}

export interface EonetProperties {
    id: string;
    title: string;
    description: string | null;
    link: string;
    closed: string | null;
    date: string;
    magnitudeValue: number | null;
    magnitudeUnit: string | null;
    categories: EonetCategory[];
    sources: EonetSource[];
}

export type EonetFeature = Feature<Point | Polygon, EonetProperties>;

export interface EonetFeatureCollection {
    type: 'FeatureCollection';
    features: EonetFeature[];
}
