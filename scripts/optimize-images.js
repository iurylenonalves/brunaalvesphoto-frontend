"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sharp = require('sharp');
var fs = require("fs");
var path = require("path");
var inputDir = 'original-photos';
var outputDir = 'public/images';
var sizes = {
    thumbnail: 500,
    medium: 1000,
    large: 1500
};
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.readdirSync(inputDir).forEach(function (file) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
        var inputPath_1 = path.join(inputDir, file);
        var filename_1 = path.parse(file).name;
        Object.entries(sizes).forEach(function (_a) {
            var size = _a[0], width = _a[1];
            var outputPath = path.join(outputDir, "".concat(filename_1, "-").concat(size, ".webp"));
            sharp(inputPath_1)
                .resize(width)
                .webp({ quality: 80 })
                .toFile(outputPath)
                .then(function () { return console.log("\u2705 Criado: ".concat(outputPath)); })
                .catch(function (err) {
                if (err instanceof Error) {
                    console.error("\u274C Erro processando ".concat(file, ":"), err.message);
                }
                else {
                    console.error("\u274C Erro desconhecido ao processar ".concat(file, ":"), err);
                }
            });
        });
    }
});
