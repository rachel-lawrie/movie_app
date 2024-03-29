const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

/**
 * Mongoose setup to connect to the MongoDB database.
 */
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Express application setup and middleware configuration.
 */
const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser");

const { check, validationResult } = require("express-validator");

app.use(morgan("common"));

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");

let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://myflix-rl-2023.netlify.app",
  "https://rachel-lawrie.github.io",
];

function checkOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.indexOf(origin) === -1) {
    // If a specific origin isn’t found on the list of allowed origins
    let message =
      "The CORS policy for this application doesn’t allow access from origin " +
      origin;
    return callback(new Error(message), false);
  }
  return callback(null, true);
}

app.use(
  cors({
    origin: checkOrigin,
  })
);

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

/**
 * GET: Retrieves a list of all movies.
 * @requires passport.authenticate - JWT authentication.
 * @returns {Object[]} An array of movie objects.
 * @example
 * // Response example
 * [
 *   {
 *     "Title": "Gladiator",
 *     "Description": "A former Roman General sets out to exact vengeance...",
 *     "ImagePath": "gladiator.png",
 *     "Featured": true,
 *     "Genre": {
 *       "Name": "Drama",
 *       "Description": "Drama films explore serious or emotional themes..."
 *     },
 *     "Director": {
 *       "Name": "Ridley Scott",
 *       "Bio": "Ridley Scott is a British film director and producer known for his work...",
 *       "Birth": "1937-11-30",
 *       "Death": null
 *     },
 *     "Actors": [],
 *     "_id": "64334bfb33557a92f4b3375d"
 *   },
 *   // Additional movie objects...
 * ]
 */
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

/**
 * GET: Retrieves data about a single movie by title.
 * @param {string} Title - The title of the movie to retrieve.
 * @returns {Object} A JSON object containing movie details including title, description, genre, director, image URL, and featured status.
 * @example
 * // Response example
 * {
 *   Title: "Gladiator",
 *   Description: "A former Roman General sets out to exact vengeance...",
 *   Genre: ["Action", "Drama"],
 *   Director: "Ridley Scott",
 *   Image: "http://localhost:3000/movies/images/gladiator",
 *   Featured: true
 * }
 */
app.get(
  "/movies/titles/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * PUT: Edits data of a single movie by title.
 * @param {string} Title - The title of the movie to edit.
 * @param {Object} body - The data to update in the movie object.
 * @returns {Object} A JSON object of the updated movie.
 * @example
 * // Response example
 * {
 *   Title: "Gladiator",
 *   Description: "A former Roman General sets out to exact vengeance...",
 *   Genre: ["Action", "Drama"],
 *   Director: "Ridley Scott",
 *   Image: "http://localhost:3000/movies/images/gladiator",
 *   Featured: true
 * }
 */
app.put("/movies/titles/:Title", (req, res) => {
  Movies.findOneAndUpdate(
    { Title: req.params.Title },
    { $set: { ImagePath: req.body.ImagePath } },
    { new: true }
  )
    .then((updatedMovie) => {
      res.json(updatedMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * GET: Retrieves all movies in a specific genre.
 * @param {string} genre_name - The name of the genre.
 * @returns {Object[]} An array of movie objects in the specified genre.
 * @example
 * // Response example:
 * [
 *   {
 *     "Title": "Gladiator",
 *     "Description": "A former Roman General sets out to exact vengeance against the corrupt emperor...",
 *     "ImagePath": "gladiator.png",
 *     "Featured": true,
 *     "Genre": {
 *       "Name": "Drama",
 *       "Description": "Drama films explore serious or emotional themes and presents them in a realistic way..."
 *     },
 *     "Director": {
 *       "Name": "Ridley Scott",
 *       "Bio": "Ridley Scott is a British film director and producer known for his work in the science fiction, fantasy, and historical genres...",
 *       "Birth": "1937-11-30",
 *       "Death": null
 *     },
 *     "Actors": [],
 *     "_id": "64334bfb33557a92f4b3375d"
 *   },
 *   // Additional movie objects...
 * ]
 */
app.get(
  "/genres/:genre_name/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * GET: Retrieves data about a specific genre.
 * @param {string} genre_name - The name of the genre.
 * @returns {Object} A JSON object containing details of the genre, including name and description.
 * @example
 * // Response example:
 * { "Name": "Drama", "Description": "Drama films explore serious or emotional themes..." }
 */
app.get(
  "/genres/:genre_name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * GET: Retrieves all movies by a specific director.
 * @param {string} director_name - The name of the director.
 * @returns {Object[]} An array of movie objects directed by the specified director.
 * @example
 * // Response example:
 * [
 *   {
 *     "Title": "Gladiator",
 *     "Description": "A former Roman General sets out to exact vengeance against the corrupt emperor...",
 *     "ImagePath": "gladiator.png",
 *     "Featured": true,
 *     "Genre": {
 *       "Name": "Drama",
 *       "Description": "Drama films explore serious or emotional themes and presents them in a realistic way..."
 *     },
 *     "Director": {
 *       "Name": "Ridley Scott",
 *       "Bio": "Ridley Scott is a British film director and producer known for his work in the science fiction, fantasy, and historical genres...",
 *       "Birth": "1937-11-30",
 *       "Death": null
 *     },
 *     "Actors": [],
 *     "_id": "64334bfb33557a92f4b3375d"
 *   },
 *   // Additional movie objects...
 * ]
 */
app.get(
  "/directors/:director_name/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * GET: Retrieves data about a specific director.
 * @param {string} director_name - The name of the director.
 * @returns {Object} A JSON object containing details of the director, including bio, date of birth, and death year.
 * @example
 * Response:
 * { "Name": "Ridley Scott", "Bio": "Ridley Scott is a highly acclaimed English film director and producer..." }
 */
app.get(
  "/directors/:director_name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

/**
 * POST: Adds a new user.
 * @param {Object} body - The user data to add. Expected to be a JSON object structured as follows:
 * @example
 * Request format:
 * {
 *
 *   "username": "r.lawrie",
 *   "email": "r@gmail.com",
 *   "password": "13cat333plate&%"
 *   "birthday": "1990-01-01
 * }
 * @returns {Object} A JSON object of the user that was added. Includes user details like ID, username, and email.
 * @example
 * Response example:
 * {
 *   "id": "2380-293-2333",
 *   "username": "r.lawrie",
 *   "email": "r@gmail.com",
 *   "birthday": "1990-01-01,
 *   "favorites": []
 * }
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - now allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

/**
 * GET: Retrieves all users.
 * @returns {Object[]} An array of user objects.
 * @example
 * // Response example:
 * [
 *   {
 *   "id": "2380-293-2333",
 *   "username": "r.lawrie",
 *   "email": "r@gmail.com",
 *   "birthday": "1990-01-01,
 *   "favorites": []
 * },
 *   { "Username": "user2"... }
 * ]
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.errer(err);
        res.status(500).send("Error: " + err);
      });
  }
);
/**
 * GET: Retrieves a user by username.
 * @param {string} Username - The username of the user.
 * @returns {Object} A JSON object
 * * @example
 * // Response example:
 * {
 *   "id": "2380-293-2333",
 *   "username": "r.lawrie",
 *   "email": "r@gmail.com",
 *   "birthday": "1990-01-01,
 *   "favorites": []
 * }
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * PUT: Updates a user's information by username.
 * @param {string} Username - The username of the user to update.
 * @param {Object} body - The updated user data.
 * @example
 * Request format:
 * {
 *   "username": "r.lawrie",
 *   "email": "r@gmail.com",
 *   "password": "13cat333plate&%"
 *   "birthday": "1990-01-01
 * }
 * @returns {Object} A JSON object of the user with the updated data.
 * @example
 * // Response example:
 * {
 *   "id": "2380-293-2333",
 *   "username": "r.lawrie",
 *   "email": "r@gmail.com",
 *   "birthday": "1990-01-01,
 *   "favorites": []
 * }
 */

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - now allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
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
  }
);

/**
 * PUT: Updates a user's password by username.
 * @param {string} Username - The username of the user.
 * @param {string} Password - The new password.
 * @returns {Object} A JSON object of the user with the updated password.
 */

app.put(
  "/users/:Username/password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Password: hashedPassword,
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
  }
);

/**
 * POST: Adds a movie to a user's list of favorites.
 * @param {string} Username - The username of the user.
 * @param {string} MovieID - The ID of the movie to add to favorites.
 * @returns {Object} A JSON object of the user with the updated list of favorites.
 */
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    {
      Username: req.params.Username,
    },
    {
      $push: { Favorites: req.params.MovieID },
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

/**
 * DELETE: Removes a movie to a user's list of favorites.
 * @param {string} Username - The username of the user.
 * @param {string} MovieID - The ID of the movie to remove from favorites.
 * @returns {Object} A JSON object of the user with the updated list of favorites.
 */
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    {
      Username: req.params.Username,
    },
    {
      $pull: { Favorites: req.params.MovieID },
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

/**
 * DELETE: Removes a user.
 * @param {string} Username - The username of the user.
 * @returns {sting} A text message that says, “[Username] was successfully deregistered.”
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
