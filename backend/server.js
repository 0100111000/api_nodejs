const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const port = 5000; 

//connexion à la BD
connectDB();

const app = express();

// Middleware pour le parsing des données JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/post", require("./routes/post.routes"));
//app.use("/signup", require("./routes/signup.routes"))
//lancer le serveur
app.listen(port, () => console.log('le server à démaré au port "' + port ));
