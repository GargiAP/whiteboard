const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    collections: 'users'
});

userSchema.statics.register = async function (name,email,password){
    try {
        if(!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }
        if(!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            throw new Error('Password strong karo');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new this({ //if using this keyword cant use arrow function up 
            name,
            email,
            password: hashedPassword
        });
        const newUser = await user.save();
        return newUser;
    }  catch (error) {
        throw new Error(error.message);
    }
}

userSchema.statics.getUser = async function (email) {
    try {
        const users = await this.find({email});
        return users;
    } catch (error){
        throw new Error(error.message);
    }
}

userSchema.statics.login = async function(email, password) {
    try{
        
        const user = await this.findOne({email});
        if(!user){
            throw new Error('invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new Error('invalid login');
        }
        return user;
    } catch(error) {
        throw new Error(error.message);
    }
};
const userModel = mongoose.model('Users',userSchema);
module.exports = userModel;