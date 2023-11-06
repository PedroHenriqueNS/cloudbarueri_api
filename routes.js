const express = require('express');
const fs = require('fs');
const multer = require('multer');
const fileModel = require('./controls/models/fileModel')
const dbController = require('./controls/dbController')

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() })


const chunkDir = __dirname + "/chunks";
const mergedFilePath = __dirname + "/media";



router.route('/api/getfiles').get(dbController.getFilesfn);
router.route('/api/getfolders').get(dbController.getFoldersfn);

router.route('/api/getonefile').get(dbController.getOneFilefn);
router.route('/api/getonefolder').get(dbController.getOneFolderfn);

router.route('/api/createfolder').post(dbController.createFolderfn);
router.route('/api/deletefolder/:id').delete(dbController.deleteFolderfn)

router.route('/api/updatefile/:id').patch(dbController.updateFilefn)
router.route('/api/updatefolder/:id').patch(dbController.updateFolderfn)



const mergeChunks = async (fileName, timestamp, totalChunks) => {
    if (!fs.existsSync(mergedFilePath)) {
        fs.mkdirSync(mergedFilePath);
    }

    const writeStream = fs.createWriteStream(`${mergedFilePath}/${timestamp}_${fileName}`);
    for (let i = 0; i < totalChunks; i++) {
        const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
        const chunkBuffer = await fs.promises.readFile(chunkFilePath);
        writeStream.write(chunkBuffer);
        fs.unlinkSync(chunkFilePath);
    }

    writeStream.end();
    console.log("File merged successfully: " + fileName);
    return true;
}



router.post('/api/upload', upload.single("file"), async (req, res) => {
    const { originalname: fileName, mimeType, timestamp } = req.body;
    
    const chunk = req.file.buffer;
    const chunkNumber = Number(req.body.chunkNumber);
    const totalChunks = Number(req.body.totalChunks);
    const size = Number(req.body.size);

    if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
    }

    const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

    try {
        await fs.promises.writeFile(chunkFilePath, chunk);
        console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

        let mergeResult = false;

        if (chunkNumber === totalChunks - 1) mergeResult = await mergeChunks(fileName, timestamp, totalChunks);

        if (mergeResult === true) {
            const post = await fileModel.create({
                name: fileName,
                mimeType: mimeType,
                size: size,
                key: `${timestamp}_${fileName}`,
                path: req.body.path,
                sharing: false,
                trashed: false,
            })
        
            if (req.file) return res.send({
                    status: true,
                    message: 'Upload realizado com sucesso',
        
                    result: post,
                    url: `http://cloudbarueri.duckdns.org:3000/api/file/${timestamp}_${fileName}`,
                })
        
            return res.status(400).json({
                status: false,
                message: "Erro ao registrar upload"
            })
        }

        return res.status(200).json({ status: true, message: "Chunk uploaded successfully" });
    } catch (error) {
        console.error("Error saving chunk:", error);
        return res.status(500).json({ status: false, message: "Error saving chunk" });
    }
})

router.delete("/api/file/deletefile/:id", async (req, res) => {
    const file = await fileModel.findByIdAndDelete(req.params.id)

    fs.unlinkSync(mergedFilePath + "/" + file.key)

    return res.send({
        status: true,
        message: "Removed",
    })
})



module.exports = router