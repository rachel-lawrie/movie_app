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
  res.send("A JSON object holding data about all movies");
});

app.get("/movies/titles/:title", (req, res) => {
  res.send("A JSON object holding data about a single movie");
});

app.get("/movies/genres/:genre", (req, res) => {
  res.send("A JSON object holding data about a genre");
});

app.get("/movies/directors/:director", (req, res) => {
  res.send("A JSON object holding data about a director");
});

app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const messaage = 'Missing "name" in request body';
    res.status(400).send(messaage);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

app.post("/users/usernames/:userName/:newUserName", (req, res) => {
  res.send(
    "A text message indicating the name of the user and the successful updating of the username."
  );
});

app.put("/users/passwords/:newPassword", (req, res) => {
  res.send(
    "A text message indicating the username and the successful updating of the password."
  );
});

app.post("/users/favorites/:userName/:movieTitle", (req, res) => {
  res.send(
    "A text message indicating [title of movie] has been added to 'Favorites.'"
  );
});

app.delete("/users/favorites/:userName/:movieTitle", (req, res) => {
  res.send(
    "A text message indicating [title of movie] has been deleted from 'Favorites.'"
  );
});

app.delete("/users/:userName", (req, res) => {
  res.send(
    "A text message that says [Username] was successfully deregistered."
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
