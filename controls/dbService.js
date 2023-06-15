const fileModel = require('./models/fileModel');
const folderModel = require('./models/folderModel');



module.exports.getFiles = () => {

    return new Promise(function checkURL(resolve, reject) {

        fileModel.find({})
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(false);
            })
    });
}
module.exports.getFolders = () => {

    return new Promise(function checkURL(resolve, reject) {

        folderModel.find({})
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(false);
            })
    });
}



module.exports.getOneFile = (id) => {

    return new Promise(function checkURL(resolve, reject) {

        fileModel.findOne(id)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(false)
            })
    })
}
module.exports.getOneFolder = (id) => {

    return new Promise(function checkURL(resolve, reject) {

        folderModel.findOne(id)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(false)
            })
    })
}



module.exports.createFolder = (folder) => {

    return new Promise(function checkURL(resolve, reject) {

        var model = new folderModel()

        model.name = folder.name
        model.path = folder.path
        model.sharing = folder.sharing
        model.trashed = folder.trashed

        model.save()
            .then((result) => {
                resolve(true);
            })
            .catch((err) => {
                reject(false)
            })
    })
}
module.exports.deleteFolder = (id) => {

    return new Promise(function checkURL(resolve, reject) {

        folderModel.findByIdAndDelete(id)
            .then((result) => {
                resolve(true)
            })
            .catch((err) => {
                reject(false)
            })
    })
}



module.exports.updateFile = (id, file) => {

    return new Promise(function checkURL(resolve, reject) {

        fileModel.findByIdAndUpdate(id, file)
            .then((res) => {
                resolve(true);
            })
            .catch((err) => {
                reject(false);
            })
    })
}
module.exports.updateFolder = (id, folder) => {

    return new Promise(function checkURL(resolve, reject) {

        folderModel.findByIdAndUpdate(id, folder)
            .then((res) => {
                resolve(true)
            })
            .catch((err) => {
                reject(false)
            })
    })
}