import type { EonetFeature, EonetFeatureCollection } from '@/types/eonet';
import http from './http';
import { ENDPOINTS } from './endpoints';

export const fetchEonetEvents = async (): Promise<EonetFeature[]> => {
    console.log('Eonet fetching...');

    const { data } = await http.get<EonetFeatureCollection>(ENDPOINTS.events.eonet);

    console.log('Eonet fetched');

    return data.features;
};
