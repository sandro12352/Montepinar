import { LotPlan, ProjectDetail } from './project-detail.data';

export interface Lot {
  readonly id: string;
  readonly block: 'A' | 'B';
  readonly area: number;
  readonly planIndex: number;
  readonly price: number;
  readonly width: number;
  readonly depth: number;
  readonly status: 'available' | 'reserved';
}

export interface LotBlock {
  readonly name: 'A' | 'B';
  readonly rows: readonly (readonly Lot[])[];
}

/** Lotes reservados del ejemplo. Es una distribución ilustrativa, no el plano oficial. */
const RESERVED = new Set(['A-03', 'A-09', 'B-02', 'B-09']);

/** Qué tipo de lote (índice en `plans`) ocupa cada columna de cada fila. */
const ROW_PATTERNS: readonly (readonly number[])[] = [
  [0, 0, 0, 1, 1, 1],
  [0, 0, 1, 1, 2, 2],
];

function parseFrontage(plan: LotPlan): { width: number; depth: number } {
  const [width, depth] = plan.frontage.match(/[\d.]+/g)?.map(Number) ?? [10, plan.area / 10];
  return { width, depth };
}

export function buildLotBlocks(project: ProjectDetail): readonly LotBlock[] {
  const lastPlan = project.plans.length - 1;

  return (['A', 'B'] as const).map((name) => {
    let counter = 0;
    const rows = ROW_PATTERNS.map((pattern) =>
      pattern.map((planIndex): Lot => {
        counter += 1;
        const index = Math.min(planIndex, lastPlan);
        const plan = project.plans[index];
        const id = `${name}-${String(counter).padStart(2, '0')}`;
        return {
          id,
          block: name,
          area: plan.area,
          planIndex: index,
          price: plan.price,
          ...parseFrontage(plan),
          status: RESERVED.has(id) ? 'reserved' : 'available',
        };
      }),
    );
    return { name, rows };
  });
}
