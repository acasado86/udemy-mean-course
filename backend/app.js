const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const app = express();

let MONGO_AUTH = '';
if (process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
    MONGO_AUTH = process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD;
}

mongoose.connect("mongodb://" + MONGO_AUTH + "@localhost:27017/udemy-mean", {useNewUrlParser: true})
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static( path.join(__dirname, '/images')));
app.use('/', express.static( path.join(__dirname, 'angular')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req,res, next) => {
    res.sendfile(path.join(__dirname, 'angular', 'index.html'));
});


module.exports = app;