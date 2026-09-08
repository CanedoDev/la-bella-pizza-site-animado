const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else if (/\.(webp|png|jpg|jpeg)$/i.test(file)) {
            results.push({ path: fullPath.replace(/\\/g, '/'), size: stat.size, sizeKB: (stat.size / 1024).toFixed(1) });
        }
    });
    return results;
}

const images = getFiles('assets/img');
images.sort((a, b) => b.size - a.size);

console.log('Top 35 largest images:');
images.slice(0, 35).forEach(img => {
    console.log(`${img.sizeKB.padStart(6)} KB  -  ${img.path}`);
});
