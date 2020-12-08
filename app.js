require("dotenv").config();
const express = require("express");
const app = express();

const sequelize = require('./db');
const controllers = require('./controllers');
const games = require('./controllers/GamingController');

const middlewares = require('./middleware');

app.use(middlewares.CORS);
app.use(express.json());

// Controller Route
app.use('/user', controllers.User);

// Protected Routes 
app.use('/games', games);

// Base Route
app.get("/", (req, res) => {
    res.json({
      message: "Howdy! Endulge in Reviewsy!",
    });
  });

//Startup messages
  sequelize.sync()
  .then(() =>
    app.listen(8080, function() {
      console.log("[server]: Nice connection mate!")
    })
  )
  .catch((e) => {
    console.log("[server]: Server Crashed");
    console.log(e);
  });