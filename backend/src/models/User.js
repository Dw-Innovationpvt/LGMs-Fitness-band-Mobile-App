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
    target: {
      // for water intake purpose
      type: Number, default: 2000,
    },
    setup: {
      // for nhi page details if user has completed the setup
      type: Boolean, default: false,
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
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    age: {
      type: Number, default: 0,
    },
    height: {
      type: Number, default: 0,
    },
    heightUnit: {
      type: String, default: "cm", // cm or inch
    },
    weight: {
      type: Number, default: 0,
    },
    weightUnit: {
      type: String, default: "kg", // kg or lb
    },
    bio: {
      type: String,
      default: "Fitness enthusiast & Professional skater",
    },
    burnTarget: {
      type: Number,
      default: 500, // default daily burn target
    },
    // ...existing code...
    mealCalorieTarget: {
      type: Number,
      default: 2000, // Default daily meal calorie intake target
    },
    stepGoal : {
      type: Number,
      default: 7000, // Default daily step goal
    },
    // ...existing code...
    mealFlag: {
      type: Boolean,
      default: false,
    },
    burnFlag: {
      type: Boolean,
      default: false,
    },

    // ... your existing fields
  dailyTargets: {
    water: { type: Number, default: 2000 },
    steps: { type: Number, default: 10000 },
    caloriesEarn: { type: Number, default: 2000 },
    caloriesBurn: { type: Number, default: 500 }
  },
  targetProgress: {
    water: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    caloriesEarn: { type: Number, default: 0 },
    caloriesBurn: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  },
  targetHistory: [{
    date: { type: Date, required: true },
    targets: {
      water: { type: Number, default: 2000 },
      steps: { type: Number, default: 10000 },
      caloriesEarn: { type: Number, default: 2000 },
      caloriesBurn: { type: Number, default: 500 }
    },
    progress: {
      water: { type: Number, default: 0 },
      steps: { type: Number, default: 0 },
      caloriesEarn: { type: Number, default: 0 },
      caloriesBurn: { type: Number, default: 0 }
    },
    completed: {
      water: { type: Boolean, default: false },
      steps: { type: Boolean, default: false },
      caloriesEarn: { type: Boolean, default: false },
      caloriesBurn: { type: Boolean, default: false }
    },
    }],

// ...existing code...
// ...existing code...

    // --- ADDED MEAL TIMES HERE ---
    mealTimes: {
      breakfast: {
        type: String,
        default: "07:00"
      },
      dinner: {
        type: String,
        default: "19:30"
      },
      lunch: {
        type: String,
        default: "12:00"
      },
      snack: {
        type: String,
        default: "16:30"
      }
    }

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