export const createIconImage = async (
    svgPath: string,
    svgViewBox: string,
    color: string,
    size = 48,
): Promise<ImageData> => {
    const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${svgViewBox}" width="${size}" height="${size}">
            <path fill="${color}" d="${svgPath}"/>
        </svg>
    `;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image(size, size);
    img.src = url;

    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.getContext('2d')!.drawImage(img, 0, 0, size, size);
    URL.revokeObjectURL(url);
    return canvas.getContext('2d')!.getImageData(0, 0, size, size);
};
