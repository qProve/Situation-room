import { naturalPreset } from './natural.preset';
import { transportPreset } from './transport.preset';

export interface Preset {
    id: string;
    label: string;
    sources: string[];
}

export const presets: Preset[] = [
    naturalPreset,
    transportPreset
];
