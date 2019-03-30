const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null,user.id)
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err, user){
        done(err, user)
    })
})

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req,email,password,done){
    req.checkBody('email','Invaled email').notEmpty().isEmail();
    req.checkBody('password','Invalied password').notEmpty().isLength({min:4});
    const errors = req.validationErrors();
    if(errors){
        let messages = [];
        errors.forEach(error=>{
            messages.push(error.msg)
        })
        return done(null,false,req.flash('error',messages))
    }
  
    User.findOne({email},function(err,user){
        if(err){
            return done(err)
        }
        if(user){
            return done(null, false, {message: 'Email already taken!'});
        }

        const newUser = new User;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function(err,result){
            if(err) return done(err);
            return done(null, newUser);
        })
    })
}));

passport.use('local.signin',new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req,email,password,done){
    req.checkBody('email','Invaled email').notEmpty().isEmail();
    req.checkBody('password','Invalied password').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        let messages = [];
        errors.forEach(error=>{
            messages.push(error.msg)
        })
        return done(null,false,req.flash('error',messages))
    }

    User.findOne({email},function(err,user){
        if(err){
            return done(err)
        }
        if(!user){
            return done(null, false, {message: 'User not found!'});
        }

        if(!user.validatePassword(password)){
            return done(null,false,{message: 'Wrong password!'})
        }
        return done(null,user);
    })
}));