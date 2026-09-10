export interface OpenskyResponse {
    time: number;
    states: OpenskyState[];
}

export interface OpenskyState {
    icao24: string;
    callsign: string | null;
    origin_country: string;
    time_position: number | null;
    last_contact: number;
    longtitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean | null;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
    category: number;
}

export const OpenskyStateCategoryMap: Record<number, string> = {
    0: 'No information',
    2: 'Light(< 15500 lbs)',
    3: 'Small(15500 to 75000 lbs)',
    4: 'Large(75000 to 300000 lbs)',
    5: 'High vortex large(aircraft such as B-757)',
    6: 'Heavy(> 300000 lbs)',
    7: 'High performance(> 5g acceleration and 400 kts)',
    8: 'Rotorcraft',
    9: 'Glider/Sailplane',
    10: 'Lighter-than-air',
    11: 'Parachutist/Skydiver',
    12: 'Ultralight/hang-glider/paraglider',
    13: 'Reserved',
    14: 'Unmanned aerial vehicle',
    15: 'Space/trans-atmospheric vehicle',
    18: 'Point obstacle',
    19: 'Cluster obstacle',
    20: 'Line obstacle',
};
