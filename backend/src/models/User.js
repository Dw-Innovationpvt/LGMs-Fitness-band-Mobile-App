import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true,
    },
    email: {
      type: String, required: true, unique: true,
    },
    password: {
      type: String, required: true, minlength: 6,
    },
    verifyOtp: {
        type: String, default: "",
    },
    isAccountVerified: {
        type: Boolean, default: false
    },
    verifyOtpExpireAt: {
        type: Number, default: 0
    },
    resetOtp: {
        type: String, default: "",
    },
    resetOtpExpireAt: {
        type: Number, default: 0
    },
    profileImage: {
      type: String, default: "",
    },

  },
  { timestamps: true }
);

// hash password before saving user to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// compare password func
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// const User = mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;