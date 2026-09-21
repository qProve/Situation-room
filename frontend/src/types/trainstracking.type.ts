export interface TrainstrackingResponse {
    trains: TrainstrackingTrain[];
    liveCountries: string[];
    stats: TrainstrackingStats;
    fetchedAt: string;
}

export interface TrainstrackingTrain {
    id: string;
    trainCode: string;
    name: string;
    status: string;
    lat: number | null;
    lng: number | null;
    direction: string;
    delay: number;
    nextStation: string;
    country: string;
    platform: string | null;
    scheduledDep: string;
    to: string;
    from: string;
    lastUpdated: string;
}

export interface TrainstrackingStats {
    total: number;
    running: number;
    withGPS: number;
    delayed: number;
}
