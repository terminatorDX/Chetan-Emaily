const passport = require("passport"),
    mongoose = require("mongoose"),
    googleStrategy = require("passport-google-oauth20").Strategy,
    keys = require("../config/keys"),
    User = mongoose.model("User");
passport.serializeUser((user, done) => {
    console.log("serializing user : ", user.id);
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        console.log("serializing user : ", user.id);
        done(null, user);
    });
});
passport.use(
    new googleStrategy(
        {
            clientID: keys.googleClientId,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleId: profile.id }).then(existingUser => {
                if (existingUser) {
                    console.log("the user exists : ", existingUser);
                    done(null, existingUser); //null means no error
                    //done means we are done here
                }
                if (!existingUser) {
                    console.log("we have a new user : ", profile.displayName);
                    new User({
                        googleId: profile.id,
                        name: profile.displayName
                    })
                        .save()
                        .then(user => done(null, user));
                }
            });
        }
    )
);
