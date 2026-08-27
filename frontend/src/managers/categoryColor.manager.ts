import type { CategoryColorReturnValue } from '@/types/categoryColorReturnValue';

const COLORS = [
    '#e74c3c', // red
    '#3498db', // blue
    '#2ecc71', // green
    '#f39c12', // orange
    '#9b59b6', // purple
    '#1abc9c', // teal
    '#e67e22', // dark orangey
    '#e91e63', // pink
    '#00bcd4', // cyan
    '#673ab7', // deep purple
    '#ff5722', // deep orange
    '#4caf50', // green
    '#9c27b0', // purple
    '#ff9800', // orange
    '#3f51b5', // indigo
    '#03a9f4', // light blue
    '#8bc34a', // lime green
    '#ffeb3b', // yellow
    '#795548', // brown
    '#607d8b', // blue gray
    '#e0e0e0', // light gray
    '#ffcdd2', // light pink
    '#cddc39', // lime
    '#009688', // teal
    '#ffc107', // amber
];

class CategoryColorManager {
    private pool = new Map<string, boolean>();
    private assignments = new Map<string, string>();

    constructor() {
        COLORS.forEach((c) => this.pool.set(c, false));
    }

    public rent(categoryId: string): string {
        if (this.assignments.has(categoryId)) return this.assignments.get(categoryId)!;

        for (const [color, rented] of this.pool) {
            if (rented) continue;

            this.pool.set(color, true);
            this.assignments.set(categoryId, color);

            return color;
        }
        return '#ffffff';
    }

    public buildExpression(): maplibregl.ExpressionSpecification {
        const matches: unknown[] = ['match', ['get', 'category']];

        this.assignments.forEach((color, categoryId) => {
            matches.push(categoryId);
            matches.push(color);
        });

        matches.push('#ffffff');

        return matches as maplibregl.ExpressionSpecification;
    }

    public getColor(categoryId: string): string {
        return this.assignments.get(categoryId) ?? '#ffffff';
    }
}

export const colorManager = new CategoryColorManager();
