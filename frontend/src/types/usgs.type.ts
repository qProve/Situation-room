import type { Feature, Point } from 'geojson';

export interface UsgsProperties {
    code: string;
    mag: number;
    place: string;
    time: number;
    title: string;
    type: string;
    url: string;
    alert: string | null;
    tsunami: number;
    status: string;
    felt: number | null;
}

export type UsgsFeature = Feature<Point, UsgsProperties>;

export interface UsgsFeatureCollection {
    type: 'FeatureCollection';
    features: UsgsFeature[];
}
