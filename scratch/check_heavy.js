const fs = require('fs');

function getWebPSize(filePath) {
    const buffer = fs.readFileSync(filePath);
    const format = buffer.toString('ascii', 12, 16);
    if (format === 'VP8X') {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { format, width, height };
    } else if (format === 'VP8L') {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        const width = 1 + (((b1 & 0x3f) << 8) | b0);
        const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
        return { format, width, height };
    } else if (format === 'VP8 ') {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        return { format, width, height };
    }
    return { format };
}

console.log('Caprese:', getWebPSize('assets/img/pizzas/pizza-caprese.webp'));
console.log('Shitake 2:', getWebPSize('assets/img/pizzas/pizza-shitake-2.webp'));
console.log('Burrata rucula:', getWebPSize('assets/img/foto-fatia-burrata-rucula.webp'));
console.log('Adega:', getWebPSize('assets/img/restaurante-adega-la-bella-pizza.webp'));
console.log('Insta-17:', getWebPSize('assets/img/instagram/insta-17.webp'));
