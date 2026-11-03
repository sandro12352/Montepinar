/** Lista de precios por sector y etapa (importes en soles). */
export interface PriceRow {
  /** Ubicación del lote dentro del sector (interior, esquina, frente a parque, etc.). */
  readonly location: string;
  readonly cash: number;
  readonly financed: number;
  readonly initial: number;
  readonly installment: number;
  readonly months: number;
}

export interface PriceGroup {
  /** Área de los lotes de este grupo, en m². */
  readonly area: number;
  readonly rows: readonly PriceRow[];
}

export interface PriceStage {
  readonly label: string;
  readonly groups: readonly PriceGroup[];
}

export interface PriceSector {
  readonly name: string;
  /** Texto corto de las áreas del sector, por ejemplo "120 y 160 m²". */
  readonly areas: string;
  readonly stages: readonly PriceStage[];
}

export interface SectorSummary {
  readonly fromCash: number;
  readonly fromInitial: number;
  readonly minMonths: number;
  readonly maxMonths: number;
}

const row = (location: string, cash: number, financed: number, initial: number, installment: number, months: number): PriceRow => ({
  location,
  cash,
  financed,
  initial,
  installment,
  months,
});

/** Resume los precios de un sector para mostrar "desde" y el rango de cuotas. */
export function summarizeSector(sector: PriceSector): SectorSummary {
  const rows = sector.stages.flatMap((stage) => stage.groups.flatMap((group) => group.rows));
  return {
    fromCash: Math.min(...rows.map((item) => item.cash)),
    fromInitial: Math.min(...rows.map((item) => item.initial)),
    minMonths: Math.min(...rows.map((item) => item.months)),
    maxMonths: Math.max(...rows.map((item) => item.months)),
  };
}

/** Palmeras de Montepinar · Lista de precios 2026 (plano de lotización 1/500, referencial). */
export const PALMERAS_SECTORS: readonly PriceSector[] = [
  {
    name: 'Sector 1',
    areas: '1,000 m²',
    stages: [
      {
        label: 'Etapa 1',
        groups: [
          {
            area: 1000,
            rows: [
              row('Lote interior', 105000, 111000, 24000, 3625, 24),
              row('Esquina interior', 110000, 116000, 26000, 3750, 24),
              row('Frente a Av. secundaria', 115000, 121000, 28000, 3875, 24),
              row('Esquina Av. secundaria', 120000, 126000, 24000, 4250, 24),
              row('Frente a Panamericana Norte', 200000, 206000, 35000, 7125, 24),
              row('Esquina Panamericana Norte', 205000, 211000, 40000, 7125, 24),
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Sector 2',
    areas: '120 y 160 m²',
    stages: [
      {
        label: 'Etapas 1 y 4',
        groups: [
          {
            area: 120,
            rows: [
              row('Lote interior', 18000, 23000, 4000, 500, 38),
              row('Esquina interior', 19000, 24000, 5000, 500, 38),
              row('Frente a colegio / hospital', 20000, 25000, 6000, 500, 38),
              row('Esquina colegio / hospital', 21000, 26000, 6200, 550, 36),
              row('Frente a Av. secundaria / parque', 22000, 27000, 7200, 550, 36),
              row('Esquina Av. secundaria / parque', 23000, 28000, 8200, 550, 36),
            ],
          },
          {
            area: 160,
            rows: [
              row('Frente a Av. secundaria', 23000, 28000, 5900, 650, 34),
              row('Esquina Av. secundaria', 25000, 30000, 6600, 650, 36),
              row('Frente a Av. principal', 29000, 34000, 7000, 750, 36),
              row('Esquina Av. principal', 31000, 36000, 7500, 750, 38),
            ],
          },
        ],
      },
      {
        label: 'Etapas 2, 3 y 5',
        groups: [
          {
            area: 120,
            rows: [
              row('Lote interior', 20000, 25000, 4600, 600, 34),
              row('Esquina interior', 21000, 26000, 5600, 600, 34),
              row('Frente a Av. secundaria / parque / centro bancario', 23000, 28000, 7600, 600, 34),
              row('Esquina Av. secundaria / parque / centro bancario', 24000, 29000, 8000, 600, 35),
            ],
          },
          {
            area: 160,
            rows: [
              row('Frente a Av. secundaria', 28000, 33000, 7800, 700, 36),
              row('Esquina Av. secundaria', 30000, 35000, 8000, 750, 36),
              row('Frente a Av. principal', 32000, 37000, 8200, 800, 36),
              row('Esquina Av. principal', 34000, 39000, 8400, 850, 36),
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Sector 3',
    areas: '160 m²',
    stages: [
      {
        label: 'Etapas 1, 2 y 5',
        groups: [
          {
            area: 160,
            rows: [
              row('Lote interior', 21000, 26000, 4400, 600, 36),
              row('Esquina interior', 23000, 28000, 5200, 600, 38),
              row('Frente a colegio / parque', 24000, 29000, 7400, 600, 36),
              row('Esquina colegio / parque', 25000, 30000, 8400, 600, 36),
              row('Frente a Av. secundaria / centro comercial', 27000, 32000, 6800, 700, 36),
              row('Esquina Av. secundaria / centro comercial', 29000, 34000, 7000, 750, 36),
              row('Frente a Av. principal', 31000, 36000, 7200, 800, 36),
              row('Esquina Av. principal', 33000, 38000, 7400, 850, 36),
            ],
          },
        ],
      },
      {
        label: 'Etapas 3 y 4',
        groups: [
          {
            area: 160,
            rows: [
              row('Lote interior', 19000, 24000, 4000, 500, 40),
              row('Esquina interior', 21000, 26000, 6200, 550, 36),
              row('Frente a colegio / parque / Av. secundaria', 23000, 28000, 5200, 600, 38),
              row('Esquina colegio / parque / Av. secundaria', 25000, 30000, 6600, 650, 36),
              row('Frente a Av. principal', 28000, 33000, 7100, 700, 37),
              row('Esquina Av. principal', 30000, 35000, 7250, 750, 37),
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Sector 4',
    areas: '200 m²',
    stages: [
      {
        label: 'Etapas 1 y 3',
        groups: [
          {
            area: 200,
            rows: [
              row('Lote interior', 21000, 26000, 4000, 550, 40),
              row('Esquina interior', 23000, 28000, 4900, 550, 42),
              row('Frente a colegio', 24000, 30000, 6600, 650, 36),
              row('Esquina colegio', 25000, 31000, 6400, 600, 36),
              row('Frente a Av. secundaria / parque', 26000, 32000, 6100, 700, 37),
              row('Esquina Av. secundaria / parque', 28000, 34000, 8100, 700, 37),
              row('Frente a Av. principal', 30000, 35000, 7250, 750, 37),
              row('Esquina Av. principal', 32000, 37000, 9250, 750, 37),
            ],
          },
        ],
      },
      {
        label: 'Etapas 2 y 4',
        groups: [
          {
            area: 200,
            rows: [
              row('Lote interior', 23000, 28000, 5200, 600, 38),
              row('Esquina interior', 25000, 30000, 7200, 600, 38),
              row('Frente a comercio / instituto', 26000, 31000, 7600, 650, 36),
              row('Esquina comercio / instituto', 27000, 32000, 8600, 650, 36),
              row('Frente a Av. secundaria / parque', 28000, 33000, 8300, 650, 38),
              row('Esquina Av. secundaria / parque', 30000, 35000, 8400, 700, 38),
              row('Frente a Av. principal', 32000, 37000, 8500, 750, 38),
              row('Esquina Av. principal', 34000, 39000, 10200, 800, 36),
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Sector 5',
    areas: '250 m²',
    stages: [
      {
        label: 'Etapa 1',
        groups: [
          {
            area: 250,
            rows: [
              row('Lote interior', 22000, 27000, 4800, 600, 37),
              row('Esquina interior', 24000, 29000, 6800, 600, 37),
              row('Frente a Av. secundaria / parque', 26000, 31000, 5100, 700, 37),
              row('Esquina Av. secundaria / parque', 28000, 33000, 7100, 700, 37),
              row('Frente a centro médico / local comunal', 26000, 31000, 5100, 700, 37),
              row('Esquina centro médico / local comunal', 28000, 33000, 7100, 700, 37),
            ],
          },
        ],
      },
      {
        label: 'Etapa 2',
        groups: [
          {
            area: 250,
            rows: [
              row('Lote interior', 24000, 29000, 5000, 600, 40),
              row('Esquina interior', 26000, 31000, 6400, 600, 41),
              row('Frente a colegio / parque / Av. secundaria', 28000, 33000, 7000, 650, 40),
              row('Esquina colegio / parque / Av. secundaria', 30000, 35000, 7000, 700, 40),
              row('Frente a Av. principal', 32000, 37000, 7750, 700, 39),
              row('Esquina Av. principal', 34000, 39000, 9750, 750, 39),
            ],
          },
        ],
      },
      {
        label: 'Etapa 3',
        groups: [
          {
            area: 250,
            rows: [
              row('Lote interior', 23000, 28000, 3400, 600, 41),
              row('Esquina interior', 25000, 30000, 6000, 600, 40),
              row('Frente a Av. secundaria / parque', 27000, 32000, 5400, 700, 38),
              row('Esquina Av. secundaria / parque', 29000, 34000, 5500, 750, 38),
              row('Frente a Av. principal', 30000, 35000, 6500, 750, 38),
              row('Esquina Av. principal', 33000, 38000, 8000, 750, 40),
            ],
          },
        ],
      },
    ],
  },
];
