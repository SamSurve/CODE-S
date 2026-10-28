export type HotspotCorner = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export interface HotspotConfig {
  corner: HotspotCorner;
  offsetX: number;
  offsetY: number;
}

export const HOTSPOT: HotspotConfig = {
  corner: 'bottom-left',
  offsetX: 6,
  offsetY: 6
};

export const SUBJECT_NAMES = {
  aoa: 'AOA',
  coa: 'COA',
  java: 'Java'
} as const;

export const ENABLE_PIN = false;

export const LIB_SECRET_HEADER = 'x-lib-secret';
export const LIB_SECRET_VALUE = 'compiler-lib-session-v1';
