const CATEGORY_COLORS = [
    '#e74c3c', // red
    '#3498db', // blue
    '#2ecc71', // green
    '#f39c12', // orange
    '#9b59b6', // purple
    '#1abc9c', // teal
    '#e67e22', // dark orange
    '#e91e63', // pink
];

const colorMap = new Map<string, string>();

export const registerCategories = (categoties: string[]) => {
    categoties.forEach((cat) => {
        if (!colorMap.has(cat)) {
            colorMap.set(cat, CATEGORY_COLORS[colorMap.size % CATEGORY_COLORS.length] ?? '#ffffff');
        }
    });
};

export const buildColorExpression = (categories: string[]): maplibregl.ExpressionSpecification => {
    if (categories.length === 0) {
        return '#ffffff' as unknown as maplibregl.ExpressionSpecification;
    }

    const matches: unknown[] = ['match', ['get', 'category']];

    categories.forEach((cat) => {
        matches.push(cat);
        matches.push(colorMap.get(cat) ?? '#ffffff');
    });

    matches.push('#ffffff');

    return matches as maplibregl.ExpressionSpecification;
};
