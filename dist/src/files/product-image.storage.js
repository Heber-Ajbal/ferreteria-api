"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productImageStorage = void 0;
exports.imageFileFilter = imageFileFilter;
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
exports.productImageStorage = (0, multer_1.diskStorage)({
    destination: (_, __, cb) => {
        const dir = 'uploads/products';
        if (!(0, fs_1.existsSync)(dir))
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_, file, cb) => {
        const id = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, id + (0, path_1.extname)(file.originalname).toLowerCase());
    },
});
function imageFileFilter(_, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Solo se permiten imágenes'), false);
    }
    cb(null, true);
}
//# sourceMappingURL=product-image.storage.js.map