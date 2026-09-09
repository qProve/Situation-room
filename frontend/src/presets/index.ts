import { naturalPreset } from './natural.preset';

export interface Preset {
    id: string;
    label: string;
    sources: string[];
}

export const presets: Preset[] = [naturalPreset];
