import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
  },
  friendlist: {
    type: Array,
  },
});

const User = mongoose.model("User", userSchema);

export default User;


// userSchema.methods.generateAccessToken = function () {
// 	const token = jwt.sign(
// 		{
// 			name: this.name,
// 			username: this.username,
// 			id: this._id,
// 		},
// 		process.env.ACCESSTOKEN_SECRET,
// 		{ expiresIn: "1d" }
// 	);
// 	return token;
// };

// userSchema.methods.generateRefreshToken = function () {
// 	return jwt.sign(
// 		{
// 			username: this.username,
// 		},
// 		process.env.REFRESHTOKEN_SERCRET,
// 		{
// 			expiresIn: "7d",
// 		}
// 	);
// }