const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		uid: { type: String, required: true, unique: true, index: true },
		email: { type: String, required: true },
		fullName: { type: String, required: true },
		phoneNumber: { type: String },
		createdAt: { type: Date, default: Date.now },
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('User', userSchema);
