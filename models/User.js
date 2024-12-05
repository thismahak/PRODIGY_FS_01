const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema definition
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role : {
        type:String,
        enum: ['user' , 'admin'],
        default:'user'
    }
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password before save:', this.password);

        next();
    } catch (err) {
        next(err); // Pass any errors to the next middleware
    }
});




// Export the User model
module.exports = mongoose.model('User', UserSchema);
