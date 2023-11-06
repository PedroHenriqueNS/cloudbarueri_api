const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
    name: String,
    mimeType: String,
    size: Number,
    key: String,
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

module.exports = mongoose.model("File", FileSchema)