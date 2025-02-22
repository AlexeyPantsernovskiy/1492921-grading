// Ключи написаны маленькими буквами, т.к. они приравнены к идентификатору типа,
// который пишется в базу и должен соответствовать типу enum в Prisma

export const GuitarType = {
  acoustic: 'acoustic',
  electric: 'electric',
  ukulele: 'ukulele',
} as const;

export type GuitarType = (typeof GuitarType)[keyof typeof GuitarType];
//export type GuitarType1Key= keyof typeof GuitarType;

export const GuitarStrings = [4, 6, 7, 12] as const;
export type GuitarStrings = (typeof GuitarStrings)[number];

export type GuitarTypeValue = {
  code: GuitarType;
  name: string;
  countStrings: GuitarStrings[];
};

export const GuitarTypeInfo: Record<GuitarType, GuitarTypeValue> = {
  acoustic: {
    code: GuitarType.acoustic,
    name: 'Акустическая гитара ',
    countStrings: [6, 7, 12],
  },
  electric: {
    code: GuitarType.electric,
    name: 'Электрогитара',
    countStrings: [4, 6, 7],
  },
  ukulele: {
    code: GuitarType.ukulele,
    name: 'Укулеле',
    countStrings: [4],
  },
} as const;

export type GuitarTypeInfo = typeof GuitarTypeInfo;
