const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    houseNo:     { type: String, required: true },
    street:      { type: String, required: true },
    landmark:    { type: String, default: '' },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    pincode:     { type: String, required: true },
    country:     { type: String, required: true },
    addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    isDefault:   { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    addresses: { type: [addressSchema], default: [] },
    cartData: { type: Object, default: {} },
    savedItems: { type: Object, default: {} },
}, { minimize: false });

module.exports = mongoose.model("User", UserSchema);
