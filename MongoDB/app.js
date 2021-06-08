const express = require('express');
const app = express();

const mongoose = require('./db/mongoose');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
// Load in the mongoose modules
const { Actor, Director, Review, Movie, User } = require('./db/modules');
const { NativeDate } = require('mongoose');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


// ACTORS

//Get a full list of actors
app.get('/actors', (req, res) => {
    Actor.find().then((actors) => {
        res.send(actors);
    }).catch((err) => {
        res.send(err);
    });
});

//Get actor with given id
app.get('/actors/:id', (req, res) => {
    Actor.findOne({
        _id: req.params.id
    }).then((actorDoc) => {
        res.send(actorDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Get actor with given firstName
app.get('/actors/actorByFirstName/:firstName', (req, res) => {
    Actor.findOne({
        'firstName': { $regex: new RegExp('.*' + req.params.firstName + '.*'), $options: "si" }
    }).then((actorDoc) => {
        res.send(actorDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Get actor with given lastName
app.get('/actors/actorByLastName/:lastName', (req, res) => {
    Actor.findOne({
        'lastName': { $regex: new RegExp('.*' + req.params.lastName + '.*'), $options: "si"}
    }).then((actorDoc) => {
        res.send(actorDoc);
    }).catch((err) => {
        res.send(err);
    });
});

// Add actor to database
app.post('/actors', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dateOfBirth = req.body.dateOfBirth;
    let dateOfDeath = req.body.dateOfDeath;
    let movieNumber = req.body.movieNumber;
    let topMovies = req.body.topMovies;
    let description = req.body.descripion;
    let newActor = new Actor({
        firstName,
        lastName,
        dateOfBirth,
        dateOfDeath,
        movieNumber,
        topMovies,
        description
    });
    newActor.save().then((actorDoc) => {
        res.send(actorDoc);
    })
});

//Update actor with given id
app.patch('/actors/:id', (req, res) => {
    Actor.findOneAndUpdate({_id:req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

//Delete actor with given id
app.delete('/actors/:id', (req, res) => {
    Actor.findOneAndRemove({
        _id:req.params.id
    }).then((removedActorDoc) => {
        res.send(removedActorDoc);
    });
});

//Find actors with a filter string in a title 
app.get('/actors/allActorInfoByMovieTitle/:filter' ,(req, res) => {
    Actor.aggregate([
        // Unwind the topMovies array
        { $unwind: "$topMovies" },
    
        // Then use match to filter only the matching entries
        { $match: 
            { 'topMovies': { "$regex": new RegExp('.*' + req.params.filter + '.*'), $options: "si" } }
        }
    ]).then((actorDoc) => {
        res.send(actorDoc);
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/actors/selectedActorInfoByMovieTitle/:filter' ,(req, res) => {
    Actor.aggregate([
        // Unwind the topMovies array
        { $unwind: "$topMovies" },
    
        // Then use match to filter only the matching entries
        { $match: 
            { 'topMovies': { "$regex": new RegExp('.*' + req.params.filter + '.*'), $options: "si" } }
        },

        { $project: {
            _id: 0,
            "First name": "$firstName", 
            "Last name": "$lastName", 
            "Birthday": {$substr: ["$birthDay", 0, 10]},
            "Passed away on" :
                { $cond: {
                    if: { $not: ['$dateOfDeath']},
                    then: "Alive",
                    else: {$substr: ["$dateOfDeath", 0, 10]}
                }},
            "Starring in" : {$concat: [ {$toString: "$movieNumber"}, " movies"]}}
        }
    ]).then((actorDoc) => {
        res.send(actorDoc);
    }).catch((err) => {
        res.send(err);
    });
});

// MOVIES

//Get a full list of movies
app.get('/movies', (req, res) => {
    Movie.find().then((movies) => {
        res.send(movies);
    }).catch((err) => {
        res.send(err);
    });
});

//Get movie with given id
app.get('/movies/:id', (req, res) => {
    Movie.findOne({
        _id: req.params.id
    }).then((movieDoc) => {
        res.send(movieDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Get movie with given id
app.get('/getMovieWithId/:id', (req, res) => {
    Movie.findOne({
        _id: req.params.id
    }).then((movieDoc) => {
        res.send(movieDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Add movie do database
app.post('/movies', (req, res) => {
    let title = req.body.title;
    let director = req.body.director;
    let actors = req.body.actors;
    let genre = req.body.genre;
    let releaseDate = req.body.releaseDate;
    let description = req.body.description;
    let newMovie = new Movie({
        title,
        director,
        actors,
        genre,
        releaseDate,
        description
    });
    newMovie.save().then((movieDoc) => {
        res.send(movieDoc);
    });
});

//Update movie with given id
app.patch('/movies/:id', (req, res) => {
    Movie.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

//Delete movie with given id
app.delete('/movies/:id', (req, res) => {
    Movie.findOneAndRemove({
        _id: req.params.id
    }).then((movieDoc) => {
        res.send(movieDoc);
    });
});

//Find movies with a filter string in a title 
app.get('/moviesByTitle/:filter', (req, res) => {
    Movie.find(
        // Use match to filter only the matching entries
            { title : { "$regex": new RegExp('.*' + req.params.filter + '.*'), $options: "si" } },
            { _id : 0 }
    ).populate(
        {
            path : 'actors',
            select : 'firstName lastName -_id',
        }
    ).populate(
        {
            path : 'director',
            select: 'firstName lastName -_id'
        }
    ).then((movieDoc) => {
        res.send(movieDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Get avg stars for movie with a given id
// app.get('/movie/:id/stars', (req, res) => {
// });


//Get avg stars for movie with a given id
app.get('/starsByMovieId/:id', (req, res) => {
    const mongoose = require("mongoose");
    Review.aggregate([
        { $group: { _id: "$movieID", avgStars: { $avg: "$stars" } } },
        { $match : { _id : new mongoose.Types.ObjectId(req.params.id)}},
        { $project: { _id: 0 }}
    ]).then((reviewDoc) => {
        res.send(reviewDoc);
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/starsByMovieTitle/:filter', (req, res) => {
    const mongoose = require("mongoose");
    Review.aggregate([
        { $lookup : { 
            from: 'movies', 
            localField: 'movieID', foreignField: '_id', 
            as: 'movie'} 
        },
        { $unwind: '$movie'},
        { $match: { 'movie.title' : { "$regex": new RegExp('.*' + req.params.filter + '.*'), $options: "si" } }},
        { $group: { _id: "$movie._id", avgStars: { $avg: "$stars" } } },
        { $project: { _id: 0, avgStars : 1}}
    ]).then((reviewDoc) => {
        res.send(reviewDoc);
    }).catch((err) => {
        res.send(err);
    });
});


// DIRECTORS

//Get a full list of directors
app.get('/directors', (req, res) => {
    Director.find().then((directors) => {
        res.send(directors);
    }).catch((err) => {
        res.send(err);
    });
});

//Get director with given id
app.get('/directors/:id', (req, res) => {
    Director.findOne({
        _id: req.params.id
    }).then((directorDoc) => {
        res.send(directorDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Add director to database
app.post('/directors', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dateOfBirth = req.body.dateOfBirth;
    let dateOfDeath = req.body.dateOfDeath;
    let movieNumber = req.body.movieNumber;
    let topMovies = req.body.topMovies;
    let description = req.body.descripion;
    let newDirector = new Director({
        firstName,
        lastName,
        dateOfBirth,
        dateOfDeath,
        movieNumber,
        topMovies,
        description
    });
    newDirector.save().then((directorDoc) => {
        res.send(directorDoc);
    });
});

//Update director with given id 
app.patch('/directors/:id', (req, res) => {
    Director.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

//Delete director with given id
app.delete('/directors/:id', (req, res) => {
    Director.findOneAndRemove({
        _id: req.params.id
    }).then((directorDoc) => {
        res.send(directorDoc);
    });
});


// REVIEWS

//Get a list of reviews
app.get('/reviews', (req, res) => {
    Review.find().then((reviews) => {
        res.send(reviews);
    }).catch((err) => {
        res.send(err);
    });
});

//Get review with given id
app.get('/reviews/:id', (req, res) => {
    Review.findOne({
        _id: req.params.id
    }).then((reviewDoc) => {
        res.send(reviewDoc);
    }).catch((err) => {
        res.send(err);
    });
});

//Add review to database
app.post('/reviews', (req, res) => {
    let author = req.body.author;
    let stars = req.body.stars;
    let reviewBody = req.body.reviewBody;
    let movieID = req.body.movieID;
    let newReview = new Review({
        author,
        stars,
        reviewBody,
        movieID
    });
    newReview.save().then((reviewDoc) => {
        res.send(reviewDoc);
    });
});

//Update review with given id
app.patch('/reviews/:id', (req, res) => {
    Review.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

//Delete review with given id
app.delete('/reviews/:id', (req, res) => {
    Review.findByIdAndRemove({
        _id: req.params.id
    }).then((reviewDoc) => {
        res.send(reviewDoc);
    });
});


// USER

//User sign up
app.post('/users', (req, res) => {
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        res.header('x-refresh-token', authTokens.refreshToken).header('x-access-token', authTokens.accessToken).send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

//User login
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
});


//Will be used later to protect api routes
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            res.status(401).send(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    });
}

let verifySession = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})




app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});