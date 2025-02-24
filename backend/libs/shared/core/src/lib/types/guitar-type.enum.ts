export const GuitarType = {
  Acoustic: 'acoustic',
  Electric: 'electric',
  Ukulele: 'ukulele',
} as const;

export type GuitarType = (typeof GuitarType)[keyof typeof GuitarType];

export const GuitarStrings = [4, 6, 7, 12] as const;
export type GuitarStrings = (typeof GuitarStrings)[number];

export type GuitarTypeValue = {
  code: GuitarType;
  name: string;
  countStrings: GuitarStrings[];
};

export const GuitarTypeInfo: Record<GuitarType, GuitarTypeValue> = {
  [GuitarType.Acoustic]: {
    code: GuitarType.Acoustic,
    name: 'Акустическая гитара ',
    countStrings: [6, 7, 12],
  },
  [GuitarType.Electric]: {
    code: GuitarType.Electric,
    name: 'Электрогитара',
    countStrings: [4, 6, 7],
  },
  [GuitarType.Ukulele]: {
    code: GuitarType.Ukulele,
    name: 'Укулеле',
    countStrings: [4],
  },
} as const;

export type GuitarTypeInfo = typeof GuitarTypeInfo;
