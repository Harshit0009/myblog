const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, // this helps in removing the whitespaces from both sides of the string
        required: [true, 'first name is required'],
        maxlength: 32,
    },

    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        match: [ ///it signifies that the field must match a specific regular expression pattern in order to be considered valid.
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email' 
        ]
    },
    password: {
        type: String,
        required: [true, 'password for user registration is mandatory'],
        minlength: [6, 'password must have at least (6) characters'],
    },

    role: {
        type: String,
        default: "user",
    }
}, {timestamps: true})

// encrypting the password before saving it
userSchema.pre('save', async function(next){ // here pre defines to perform the function operation on the method defined, i.e. 'save'
    console.log('inside the pre block');
    if(!this.isModified('password')){
        next();

    }
    this.password = await bcrypt.hash(this.password, 10);  // becrypt the password to length 10 key
    console.log(this.password);
})

// comparing the user password, validating before extraction
userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password)
}
// methods are the functions that we need to call on schema fields
// return a JWT token for logging in the user
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600 // time after which the id expires
    });
}

module.exports = mongoose.model("User", userSchema);