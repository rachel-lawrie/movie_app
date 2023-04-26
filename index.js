const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser");

app.use(morgan("common"));

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

// Return a list of ALL movies to the user
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  }
);

// Return data on a single movie by movie title
app.get("/movies/titles/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        return res
          .status(404)
          .send("Error: " + req.params.Title + " was not found");
      } else {
        res.json(movie);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return all movies in a genre
app.get("/movies/by_genres/:genre_name", (req, res) => {
  Movies.find({ "Genre.Name": req.params.genre_name })
    .then((genre) => {
      if (!genre) {
        return res
          .status(404)
          .send("Error: " + req.params.genre_name + " was not found");
      } else {
        res.json(genre);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a genre
app.get("/movies/genres/:genre_name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genre_name })
    .then((genre) => {
      if (!genre) {
        return res
          .status(404)
          .send("Error: " + req.params.genre_name + " was not found");
      } else {
        res.json(genre.Genre);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return all movies with a specific director
app.get("/movies/by_directors/:director_name", (req, res) => {
  Movies.find({ "Director.Name": req.params.director_name })
    .then((director) => {
      if (!director) {
        return res
          .status(404)
          .send("Error: " + req.params.director_name + " was not found");
      } else {
        res.json(director);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about a director
app.get("/movies/directors/:director_name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.director_name })
    .then((director) => {
      if (!director) {
        return res
          .status(404)
          .send("Error: " + req.params.director_name + " was not found");
      } else {
        res.json(director.Director);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Get all users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.errer(err);
      res.status(500).send("Error: " + err);
    });
});

//Get a user by username
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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

// Add a movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    {
      Username: req.params.Username,
    },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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

// Delete a user by username
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({
    Username: req.params.Username,
  })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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
