export interface EonetCategory {
    id: string;
    title: string;
}

export interface EonetSource {
    id: string;
    title: string;
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

export interface EonetGeometry {
    type: 'Point' | 'Polygon';
    coordinates: number[] | number[][][];
}

export interface EonetFeature {
    type: 'Feature';
    properties: EonetProperties;
    geometry: EonetGeometry;
}

export interface EonetFeatureCollection {
    type: 'FeatureCollection';
    features: EonetFeature[];
}
