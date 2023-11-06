const mongoose = require('mongoose')

const FolderSchema = new mongoose.Schema({
    name: String,
    path: String,
    sharing: Boolean,
    trashed: Boolean,
    trashedDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("Folder", FolderSchema)