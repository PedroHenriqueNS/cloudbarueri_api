var dbService = require("./dbService");
const dotenv = require("dotenv").config("../.env");



var getFilesfn = async (req, res) => {
    if (req.headers.apikey) {
        if (req.headers.apikey === process.env.API_KEY) {

            let files = await dbService.getFiles();
            res.send({ "status": true, "data": files })
        } else {
            res.send({ status: false, "message": "Wrong API Key" })
        }
    } else {
        res.send({ status: false, "message": "API Key not found" })
    }
}
var getFoldersfn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let folders = await dbService.getFolders();
        res.send({ "status": true, "data": folders });
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}



const getOneFilefn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let file = await dbService.getOneFile(req.params.id);
        res.send({ "status": true, "data": file })
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}
const getOneFolderfn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let file = await dbService.getOneFile(req.params.id);
        res.send({ "status": true, "data": file })
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}



const createFolderfn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let result = await dbService.createFolder(req.body)

        if (result) {
            res.send({ "status": true, "message": "Pasta criada com sucesso!", "result": result })
        } else {
            res.send({ "status": false, "message": "Houve uma falha ao criar uma pasta.", "result": result })
        }
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}



var updateFilefn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let result = await dbService.updateFile(req.params.id, req.body);

        if (result) {
            let folderResult = await dbService.getFolders();
            if (folderResult) {
                for (let i = 0; i < folderResult.length; i++) {
                    await dbService.updateFolder(folderResult[i]._id, folderResult[i])
                }
            }

            res.send({ "status": true, "message": "Arquivo atualizado com sucesso!", "result": result })
        } else {
            res.send({ "status": false, "message": "Houve uma falha ao atualizar um arquivo.", "result": result })
        }
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}
var updateFolderfn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let result = await dbService.updateFolder(req.params.id, req.body)

        if (result) {
            res.send({ "status": true, "message": "Pasta atualizada com sucesso", "result": result })
        } else {
            res.send({ "status": false, "message": "Houve uma falha ao atualizar uma pasta.", "result": result })
        }
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}



const deleteFolderfn = async (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {

        let result = await dbService.deleteFolder(req.params.id)

        if (result) {
            res.send({ "status": true, "message": "Pasta removida com sucesso", "result": result })
        } else {
            res.send({ "status": false, "message": "Houve uma falha ao remover uma pasta.", "result": result })
        }
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
}



module.exports = {
    getFilesfn, getFoldersfn,
    getOneFilefn, getOneFolderfn,
    createFolderfn, deleteFolderfn,
    updateFilefn, updateFolderfn,
}