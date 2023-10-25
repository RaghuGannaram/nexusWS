const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: [true, "firstname is required, received {VALUE}"],
			minLength: [3, "firstname length must be greater than or equal to 3, received {VALUE}"],
			maxength: [20, "firstname length must be less than or equal to 20, received {VALUE}"],
		},
		lastname: {
			type: String,
			required: [true, "lastname is required, received {VALUE}"],
			minLength: [3, "lastname length must be greater than or equal to 3, received {VALUE}"],
			maxength: [20, "lastname length must be less than or equal to 20, received {VALUE}"],
		},
		username: {
			type: String,
			required: [true, "username is required, received {VALUE}"],
			minLength: [3, "username length must be greater than or equal to 3, received {VALUE}"],
			maxength: [20, "username length must be less than or equal to 20, received {VALUE}"],
            lowercase: [true, "username must be lowercase, received {VALUE}"],
            unique: [true, "username must be unique, received {VALUE}"],
		},
		email: {
			type: String,
			required: [true, "email is required, received {VALUE}"],
			minLength: [5, "email length must be greater than or equal to 5, received {VALUE}"],
			maxLength: [100, "email length must be less than or equal to 20, received {VALUE}"],
            lowercase: [true, "email must be lowercase, received {VALUE}"],
            unique: [true, "email must be unique, received {VALUE}"],
		},
		password: {
			type: String,
			required: [true, "password is required, received {VALUE}"],
			minLength: [8, "password length must be greater than or equal to 8, received {VALUE}"],
			maxLength: [100, "password length must be less than or equal to 100, received {VALUE}"],
		},
		role: {
			type: String,
			enum: ["user", "moderator"],
			default: "user",
		},
		followers: {
			type: [String],
			default: [],
		},
		followings: {
			type: [String],
			default: [],
		},
	},
	{
		collection: "userCollection",
		autoIndex: true,
		optimisticConcurrency: true,
		bufferTimeoutMS: 10000,
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
