import { ValueTransformer } from "typeorm";

export const ModeloTransformer: ValueTransformer = {
  // BD → Backend
  from(value: number | null): string {
    const map: Record<number, string> = {
      0: 'Sin impresora',
      1: 'Térmica',
      2: 'Disglobal',
    };

    return map[value ?? 0] ?? 'Sin impresora';
  },

  // Backend → BD
  to(value: string | number): number {
    const reverseMap: Record<string, number> = {
      'Sin impresora': 0,
      'Térmica': 1,
      'Disglobal': 2,
    };

    // Si viene número, déjalo pasar
    if (typeof value === 'number') return value;

    return reverseMap[value] ?? 0;
  }
};
