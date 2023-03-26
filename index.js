const express = require("express"),
  morgan = require("morgan");

const app = express();

let top10movies = [
  {
    title: "Cindarella Man",
    year: 2005,
    actors: "Russell Crowe, Renee Zellweger, Craig Bierko",
  },
  {
    title: "Gladiator",
    year: 2000,
    actors: "Russell Crowe, Joaquin Phoenix, Connie Nielson",
  },
  {
    title: "Parasite",
    year: 2019,
    actors: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",
  },
  {
    title: "Girls Trip",
    year: 2017,
    actors: "Regina Hall, Queen Latifah, Jada Pinkett Smith",
  },
];

app.use(morgan("common"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/movies", (req, res) => {
  res.json(top10movies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
