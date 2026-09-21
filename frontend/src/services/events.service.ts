import type { EonetFeature, EonetFeatureCollection } from '@/types/eonet.type';
import http from './http';
import { ENDPOINTS } from './endpoints';
import type { UsgsFeature, UsgsFeatureCollection } from '@/types/usgs.type';
import type { OpenskyResponse, OpenskyState } from '@/types/opensky.type';
import type { TrainstrackingTrain } from '@/types/trainstracking.type';

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

export const fetchOpenskyEvents = async (): Promise<OpenskyState[]> => {
    console.log('Opensky fetching...');

    const { data } = await http.get<OpenskyResponse>(ENDPOINTS.events.opensky);

    console.log('Opensky fetched');

    return data.states;
};

export const fetchTrainstrackingEvents = async (): Promise<TrainstrackingTrain[]> => {
    console.log('Trainstracking fetching...');

    const { data } = await http.get(ENDPOINTS.events.traintracking);

    console.log('Trainstracking fetched');

    return data.trains;
}