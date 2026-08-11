import type { EonetFeature, EonetFeatureCollection } from '@/types/eonet';
import http from './http';
import { ENDPOINTS } from './endpoints';

export const fetchNasaEvents = async (): Promise<EonetFeature[]> => {
    const { data } = await http.get<EonetFeatureCollection>(ENDPOINTS.events.nasa);
    return data.features;
};
