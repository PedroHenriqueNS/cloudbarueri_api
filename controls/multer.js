const multer = require('multer');
const path = require('path');

module.exports = {
    dest: path.resolve(__dirname, "..", "public", "general"),
    // dest: '../public/general',
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "public", "general"))
            // cb(null, './public/general')
        },
        filename: (req, file, cb) => {
                const fileName = `${Date.now()}_${Buffer.from(file.originalname, 'latin1').toString('utf8')}`
                cb(null, fileName)
        }
    })
}