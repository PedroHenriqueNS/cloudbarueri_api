const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerConfig = multer(require('../controls/multer'))
const fileModel = require('../controls/models/fileModel')
const dbController = require('../controls/dbController')

const router = express.Router();



// GENERAL ROUTES ------------------------------

router.route('/api/getfiles').get(dbController.getFilesfn);
router.route('/api/getfolders').get(dbController.getFoldersfn);

router.route('/api/getonefile').get(dbController.getOneFilefn);
router.route('/api/getonefolder').get(dbController.getOneFolderfn);

router.route('/api/createfolder').post(dbController.createFolderfn);
router.route('/api/deletefolder/:id').delete(dbController.deleteFolderfn)

router.route('/api/updatefile/:id').patch(dbController.updateFilefn)
router.route('/api/updatefolder/:id').patch(dbController.updateFolderfn)



// FILES ROUTES --------------------------------

router.post("/api/file/uploadfile", multerConfig.single('file'), async (req, res) => {
    const { originalname: name, size, mimetype, filename: key } = req.file

    const post = await fileModel.create({
        name: name,
        mimeType: mimetype,
        size: size,
        key: key,
        path: req.body.path,
        sharing: false,
        trashed: false,
    })

    if (req.file) {
        return res.send({
            status: true,
            message: 'Upload realizado com sucesso',

            result: post,
            url: `http://cloudbarueri.duckdns.org:3000/api/file/${key}`,
        })
    }

    return res.status(400).json({
        status: false,
        message: "Erro ao fazer upload"
    })
})

router.delete("/api/file/deletefile/:id", async (req, res) => {
    const file = await fileModel.findByIdAndDelete(req.params.id)

    fs.unlinkSync(path.resolve(__dirname, "..", "public", "general") + "/" + file.key)

    return res.send({
        status: true,
        message: "Removed",
    })
})



module.exports = router