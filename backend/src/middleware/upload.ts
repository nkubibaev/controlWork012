import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'public/uploads/recipes');
    },

    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `${randomUUID()}${extension}`;

        cb(null, filename);
    },
});

export const upload = multer({
    storage,
});