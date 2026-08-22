import type { EonetFeature, EonetFeatureCollection } from '@/types/eonet';
import http from './http';
import { ENDPOINTS } from './endpoints';

export const fetchNasaEvents = async (onlyActive: boolean = false): Promise<EonetFeature[]> => {
    console.log('Nasa fetching...');

    const { data } = await http.get<EonetFeatureCollection>(ENDPOINTS.events.nasa);

    console.log('Nasa fetched');
    if (onlyActive) {
        return data.features.filter(f => f.properties.closed === null);
    }

    return data.features;
};
