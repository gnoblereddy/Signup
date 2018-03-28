var express = require('express');
var router = express.Router();
var Person = require('../models/mod')

function checkSignIn(req, res, next) {
    if (req.session.user) {
        console.log("Second" + req.session.user);
        next();
    }
    else {
        var err = new Error("Not loggeg in!");
        console.log(req.session.user);
        res.render("logout");
    }
}


router.get('/signup', function (req, res) {
    res.render('signup');
});

router.post('/signup', function (req, res) {
    var personInfo = req.body; //Get the parsed information

    if (!personInfo.id || !personInfo.password) {
        res.render('protected_page', {
            message: "Sorry, you provided worng info", type: "error"
        });
    } else {
        var newPerson = new Person({
            id: personInfo.id,
            password: personInfo.password
        });

        newPerson.save(function (err, Person) {
            if (err)
                //res.render('protected_page', { message: "Database error", type: "error" });
                console.log(err);
            else
                res.render('login', {
                    message: "New person added", type: "success", person: personInfo
                });
        });
    }
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    var personInfo = req.body;
    var id = personInfo.id;
    var password = personInfo.password;


    Person.findOne({ id: id },
        function (err, user) {
            if (err) {
                console.log("login fail");
            }
            if (!user) {
                res.render('show_message', {
                    message: "Your password or id not in database"
                });
            }
            else {
                user.comparePassword(password, function (err, isMatch) {

                    if (err) {
                        res.send(err);
                    }

                    if (isMatch) {
                        req.session.user = personInfo.id;
                        res.render('home');

                    }
                    else {
                        res.send('loginfail');

                    }


                });
            }
        }
    )
})

router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out")
    });
    res.redirect('/login');
})

router.get('/profile', checkSignIn, function (req, res, next) {
    res.render('profile');
})

module.exports = router;