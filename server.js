const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const routes = require('./routes');

const server = express();



mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.USER_AND_CLUSTER}/?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true, enableUtf8Validation: false 
})
    .then(() => console.log("Banco de dados conectado com sucesso!"))
    .catch(err => console.log("Erro ao conectar ao banco de dados. \nErro: " + err))



server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cors())
server.use(morgan("dev"))

server.use(routes)



server.use("/api/file", express.static(path.resolve(__dirname, "media")))
server.use('/api/download/file/:key', (req, res) => {
    if (req.headers.apikey === process.env.API_KEY) {
        res.download(`./media/${req.params.key}`)
    } else {
        res.send({ status: false, "message": "Wrong API Key" })
    }
})



server.listen(3000, () => {
    var ip = require("ip");
    console.log("Servidor criado com sucesso! Endereço:\n" + ip.address('public') + ":" + 3000);
})