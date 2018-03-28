var mongoose = require('mongoose');
var bcrypt = require('bcrypt');



var personSchema = new mongoose.Schema({
    id: String,
    password: String
}, { collection: 'Person' });

//Hashing 

personSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // hash the password using our new salt
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
    // });
});

personSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var Person = mongoose.model("Person", personSchema);

module.exports = Person;