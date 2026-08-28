import type { EonetFeature, EonetFeatureCollection } from '@/types/eonet';
import http from './http';
import { ENDPOINTS } from './endpoints';
import type { UsgsFeature, UsgsFeatureCollection } from '@/types/usgs';

export const fetchEonetEvents = async (): Promise<EonetFeature[]> => {
    console.log('Eonet fetching...');

    const { data } = await http.get<EonetFeatureCollection>(ENDPOINTS.events.eonet);

    console.log('Eonet fetched');

    return data.features;
};

export const fetchUsgsEvents = async (): Promise<UsgsFeature[]> => {
    console.log('Usgs fetching...');

    const { data } = await http.get<UsgsFeatureCollection>(ENDPOINTS.events.usgs);

    console.log('Usgs fetched');

    return data.features;
};
