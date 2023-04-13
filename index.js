if (process.env.NODE_ENV !== "production") { // check if environment is not production
  require('dotenv').config(); // load environment variables from .env file
}

const express = require('express'); // import the express library
const app = express(); // create an instance of express
const path = require('path'); // import the path library for working with file paths
const mongoose = require('mongoose'); // import the mongoose library for working with MongoDB
const methodOverride = require('method-override'); // import method override for HTTP methods other than GET and POST
const catchAsync = require('./utils/catchAsync'); // import a custom utility function for catching async errors
const ExpressError = require('./utils/ExpressError'); // import a custom utility function for creating HTTP errors
const ejsMate = require('ejs-mate'); // import the ejs-mate library for using EJS templates
const flash = require('connect-flash'); // import the connect-flash library for displaying flash messages
const session = require('express-session'); // import the express-session library for managing user sessions
const passport= require ('passport'); // import the passport library for user authentication
const LocalStrategy = (require('passport-local')); // import the passport-local library for using the local authentication strategy
const User = require('./models/users'); // import the User model for working with user data



// user and leads routes
const leadsRoutes = require('./routes/leads') // import the leads routes
const userRoutes = require('./routes/users') // import the user routes

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crm-app');

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected ");
});

// configure view engine
app.engine('ejs', ejsMate); // use ejs-mate as the view engine
app.set('view engine', 'ejs') // set the view engine to ejs
app.set('views', path.join(__dirname, '/views')) // set the directory for views


// middleware
app.use(express.urlencoded({ extended: true })) // parse incoming form data
app.use(methodOverride('_method')) // allow HTTP methods other than GET and POST
app.use(express.static(path.join(__dirname, '/public'))) // serve static files from the public directory

// configure session middleware
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!', // secret used to sign the session ID cookie
  resave: false, // don't save the session if it hasn't been modified
  saveUninitialized: true, // create a new session for a user who hasn't been initialized
  cookie: {
      httpOnly: true, // only allow HTTP requests to access the session ID cookie
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // set the cookie to expire in 1 week
      maxAge: 1000 * 60 * 60 * 24 * 7 // set the maximum age of the cookie to 1 week
  }
}

app.use(session(sessionConfig)) // use session middleware
app.use(flash()); // use connect-flash middleware for displaying flash messages

// configure passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables for use in templates
app.listen(3000, () => {
  console.log('Serving on port 3000')
})
