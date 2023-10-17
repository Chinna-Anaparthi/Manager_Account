const express = require('express')
let app = express()
const Server= require("./LogicServer")
const mongoose = require("mongoose");
var parser = require("body-parser");
const dotenv = require("dotenv").config();
app.use(parser.json());
const cors = require('cors');
app.use(cors());
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Manager_Account MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.post('/RegularFieldWork', (req, res) => {
    Server.FieldworkPost(req, res, () => { });
})

app.get('/RegularFieldWorkRetrive', (req, res) => {
    Server.FieldworkGet(req, res, () => { })
})

app.put('/RegularFieldWork-Status-Update/:employeeId', (req, res) => {
  Server.FieldworkStatusUpdate(req, res, () => { });
})

app.post('/TrainingWorkshop', (req, res) => {
    Server.TrainingWorkshopPost(req, res, () => { });
})

app.get('/TrainingWorkshopRetrive', (req, res) => {
    Server.TrainingWorkshopGet(req, res, () => { })
})

app.put('/TrainingWorkshop-Status-Update/:employeeId', (req, res) => {
    Server.TrainingWorkshopstatusUpdate(req, res, () => { });
})
const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})