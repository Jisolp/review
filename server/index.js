const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const session = require('express-session');
const passport = require('passport');

require('./models/userModel');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();
app.use(
    session({
        secret: keys.cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30*24*60*60*1000 // 30 days
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5001
app.listen(PORT);