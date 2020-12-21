const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve(__dirname,'..','uploads','produtos'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname,'..','uploads','produtos'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString('hex')}${ path.extname(file.originalname)}`;
                cb(null,fileName);
            });
        }
    }),
    limits: {
        filesize: 2 * 1024 * 1024 // 2 MEGABYTES
    },
    fileFilter: (req, file, cb) => {
        const allowMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        if (allowMimes.includes(file.mimetype)) {
            cb(null, true);
        }else{
            cb(new Error('Invalid file type.'));
        }
    }
};