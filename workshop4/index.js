const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');


app.use(bodyParser.json());
app.use(cors({
    domains: '*',
    methods: "*"
}));

//para la conexion a bd
const db = mongoose.connect("mongodb+srv://JoselynTijerino:JoselynTijerino@cluster0.6sdzi3m.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const { careerGet, careerPost, careerPut, careerDelete } = require('./server/controllers/careerController');
app.get("/api/career/", careerGet);
app.post("/api/career/", careerPost);
app.put("/api/career", careerPut);
app.delete("/api/career", careerDelete);




// Iniciar el servidor
const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

