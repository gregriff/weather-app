// models DB tables, excluding unnessicary data
export interface City {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    gridpointOffice: string;
    gridpointX: number;
    gridpointY: number;
}

export interface CurrentLocation {
    latitude: number;
    longitude: number;
}

export interface Settings {
    favoriteCityId?: string;
    lastKnownGridpointX?: number;
    lastKnownGridpointY?: number;
    celcius: boolean;
    savedCities: City[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    settings: Settings;
}
