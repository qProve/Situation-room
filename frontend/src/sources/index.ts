import { eonetSource } from "./eonet.source";
import type { SourceDefinition } from "./registry";
import { usgsSource } from "./usgs.source";

export type { SourceDefinition }

export const sourceRegistry: SourceDefinition[] = [
    eonetSource,
    usgsSource
];