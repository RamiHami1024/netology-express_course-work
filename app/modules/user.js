const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.UserModule = {
    create: async function(data){
        try {
            const newUser = new User(data);
            await newUser.save();

            return newUser;
        } catch (error) {
            console.log(error)
            throw Error('\nat UserModule.create.\n' + error);
        }
    },
    findByEmail: async function(email, cb){
        try {
            const user = await User.findOne({email: email});

            user ? cb(null, user) : cb(null, null);
        } catch (error) {
            throw Error(`\nat UserModule.findByEmail.\n${error}`);
        }
    },
    verifyPassword: async function(password, hash){
        try {
            const checkPass = bcrypt.compare(password, hash, (err, res) => res);

            return checkPass;
        } catch (error) {
            throw Error(`\nError at verify\n${error}`);
        }
    },
    findById: async function(id, cb){
        try {
            const user = await User.findById(id);
            
            Object.keys(user).length ?
                cb(null, user) :
                cb(null, null)
        } catch (error) {
            throw Error(`\nat UserModule.findById\n${error}`);
        }
    }
}