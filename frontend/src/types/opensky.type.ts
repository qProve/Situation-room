export interface OpenskyResponse {
    time: number;
    states: OpenskyState[];
}

export type OpenskyState = [
    string, // 0  icao24
    string | null, // 1  callsign
    string, // 2  origin_country
    number | null, // 3  time_position
    number, // 4  last_contact
    number | null, // 5  longitude
    number | null, // 6  latitude
    number | null, // 7  baro_altitude
    boolean | null, // 8  on_ground
    number | null, // 9  velocity
    number | null, // 10 true_track
    number | null, // 11 vertical_rate
    number[] | null, // 12 sensors
    number | null, // 13 geo_altitude
    string | null, // 14 squawk
    boolean, // 15 spi
    number, // 16 position_source
    number, // 17 category
];

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
