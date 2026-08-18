import type { EonetFeature, EonetFeatureCollection } from '@/types/eonet';
import http from './http';
import { ENDPOINTS } from './endpoints';

export const fetchNasaEvents = async (): Promise<EonetFeature[]> => {
    console.log('Nasa fetching...');

    const { data } = await http.get<EonetFeatureCollection>(ENDPOINTS.events.nasa);

    console.log('Nasa fetched');
    return data.features;
};
