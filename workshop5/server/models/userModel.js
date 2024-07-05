const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userCarrerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Encriptar la contraseña antes de guardar el usuario
userCarrerSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('UserCarrer', userCarrerSchema);
