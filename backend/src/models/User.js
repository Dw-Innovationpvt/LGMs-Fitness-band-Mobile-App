import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    age: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    heightUnit: {
      type: String,
      default: "cm", // cm or inch
    },
    weight: {
      type: Number,
      default: 0,
    },
    weightUnit: {
      type: String,
      default: "kg", // kg or lb
    },
    bio: {
      type: String,
      default: "Fitness enthusiast & Professional skater",
    },
    mealFlag: {
      type: Boolean,
      default: false,
    },
    burnFlag: {
      type: Boolean,
      default: false,
    },
    target: {
      type: Number,
      default: 2000, // Default water intake target (milliliters)
    },
    setup: {
      type: Boolean,
      default: false,
    },
    mealCalorieTarget: {
      type: Number,
      default: 2000, // Default daily meal calorie intake target
    },
    stepGoal: {
      type: Number,
      default: 7000, // Default daily step goal
    },
    burnTarget: {
      type: Number,
      default: 500, // Default daily burn target
    },
    mealTimes: {
      breakfast: {
        type: String,
        default: "07:00",
      },
      dinner: {
        type: String,
        default: "19:30",
      },
      lunch: {
        type: String,
        default: "12:00",
      },
      snack: {
        type: String,
        default: "16:30",
      },
    },
    weeklyGoals: [
      {
        date: {
          type: Date,
          required: true,
        },
        goals: {
          water: {
            target: { type: Number, default: null }, // Uses user.target
            progress: { type: Number, default: 0 },
            achieved: { type: Boolean, default: false },
          },
          steps: {
            target: { type: Number, default: null }, // Uses user.stepGoal
            progress: { type: Number, default: 0 },
            achieved: { type: Boolean, default: false },
          },
          caloriesEarned: {
            target: { type: Number, default: null }, // Uses user.mealCalorieTarget
            progress: { type: Number, default: 0 },
            achieved: { type: Boolean, default: false },
          },
          caloriesBurned: {
            target: { type: Number, default: null }, // Uses user.burnTarget
            progress: { type: Number, default: 0 },
            achieved: { type: Boolean, default: false },
          },
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// Initialize weeklyGoals for new users and maintain 7 days
userSchema.pre("save", function (next) {
  // Initialize weeklyGoals for new users
  if (this.isNew && this.weeklyGoals.length === 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.weeklyGoals = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return {
        date,
        goals: {
          water: { target: this.target, progress: 0, achieved: false },
          steps: { target: this.stepGoal, progress: 0, achieved: false },
          caloriesEarned: { target: this.mealCalorieTarget, progress: 0, achieved: false },
          caloriesBurned: { target: this.burnTarget, progress: 0, achieved: false },
        },
      };
    }).sort((a, b) => b.date - a.date); // Most recent first
  }

  // Ensure targets are set from top-level fields if null
  this.weeklyGoals.forEach(day => {
    day.goals.water.target = day.goals.water.target ?? this.target;
    day.goals.steps.target = day.goals.steps.target ?? this.stepGoal;
    day.goals.caloriesEarned.target = day.goals.caloriesEarned.target ?? this.mealCalorieTarget;
    day.goals.caloriesBurned.target = day.goals.caloriesBurned.target ?? this.burnTarget;
  });

  // Maintain exactly 7 days
  if (this.weeklyGoals.length > 7) {
    this.weeklyGoals = this.weeklyGoals.sort((a, b) => b.date - a.date).slice(0, 7);
  }

  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;


// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     verifyOtp: {
//       type: String,
//       default: "",
//     },
//     isAccountVerified: {
//       type: Boolean,
//       default: false,
//     },
//     verifyOtpExpireAt: {
//       type: Number,
//       default: 0,
//     },
//     resetOtp: {
//       type: String,
//       default: "",
//     },
//     resetOtpExpireAt: {
//       type: Number,
//       default: 0,
//     },
//     profileImage: {
//       type: String,
//       default: "",
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female"],
//       default: "male",
//     },
//     age: {
//       type: Number,
//       default: 0,
//     },
//     height: {
//       type: Number,
//       default: 0,
//     },
//     heightUnit: {
//       type: String,
//       default: "cm", // cm or inch
//     },
//     weight: {
//       type: Number,
//       default: 0,
//     },
//     weightUnit: {
//       type: String,
//       default: "kg", // kg or lb
//     },
//     bio: {
//       type: String,
//       default: "Fitness enthusiast & Professional skater",
//     },
//     mealFlag: {
//       type: Boolean,
//       default: false,
//     },
//     burnFlag: {
//       type: Boolean,
//       default: false,
//     },
//     target: {
//       type: Number,
//       default: 2000, // Default water intake target (milliliters)
//     },
//     setup: {
//       type: Boolean,
//       default: false,
//     },
//     mealCalorieTarget: {
//       type: Number,
//       default: 2000, // Default daily meal calorie intake target
//     },
//     stepGoal: {
//       type: Number,
//       default: 7000, // Default daily step goal
//     },
//     burnTarget: {
//       type: Number,
//       default: 500, // Default daily burn target
//     },
//     mealTimes: {
//       breakfast: {
//         type: String,
//         default: "07:00",
//       },
//       dinner: {
//         type: String,
//         default: "19:30",
//       },
//       lunch: {
//         type: String,
//         default: "12:00",
//       },
//       snack: {
//         type: String,
//         default: "16:30",
//       },
//     },
//     weeklyGoals: [
//       {
//         date: {
//           type: Date,
//           required: true,
//         },
//         goals: {
//           water: {
//             target: { type: Number, default: null }, // Will use user.target
//             progress: { type: Number, default: 0 },
//             achieved: { type: Boolean, default: false },
//           },
//           steps: {
//             target: { type: Number, default: null }, // Will use user.stepGoal
//             progress: { type: Number, default: 0 },
//             achieved: { type: Boolean, default: false },
//           },
//           caloriesEarned: {
//             target: { type: Number, default: null }, // Will use user.mealCalorieTarget
//             progress: { type: Number, default: 0 },
//             achieved: { type: Boolean, default: false },
//           },
//           caloriesBurned: {
//             target: { type: Number, default: null }, // Will use user.burnTarget
//             progress: { type: Number, default: 0 },
//             achieved: { type: Boolean, default: false },
//           },
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password
// userSchema.methods.comparePassword = async function (userPassword) {
//   return await bcrypt.compare(userPassword, this.password);
// };

// // Ensure weeklyGoals has at most 7 days
// userSchema.pre("save", function (next) {
//   if (this.weeklyGoals.length > 7) {
//     this.weeklyGoals = this.weeklyGoals.sort((a, b) => b.date - a.date).slice(0, 7);
//   }
//   // Set default targets from top-level fields if not specified
//   this.weeklyGoals.forEach(day => {
//     day.goals.water.target = day.goals.water.target ?? this.target;
//     day.goals.steps.target = day.goals.steps.target ?? this.stepGoal;
//     day.goals.caloriesEarned.target = day.goals.caloriesEarned.target ?? this.mealCalorieTarget;
//     day.goals.caloriesBurned.target = day.goals.caloriesBurned.target ?? this.burnTarget;
//   });
//   next();
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;



// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";

// // const userSchema = new mongoose.Schema(
// //   {
// //     username: {
// //       type: String, required: true, unique: true,
// //     },
// //     email: {
// //       type: String, required: true, unique: true,
// //     },
// //     setup: {
// //       // for nhi page details if user has completed the setup
// //       type: Boolean, default: false,
// //     },
// //     password: {
// //       type: String, required: true, minlength: 6,
// //     },
// //     verifyOtp: {
// //         type: String, default: "",
// //     },
// //     isAccountVerified: {
// //         type: Boolean, default: false
// //     },
// //     verifyOtpExpireAt: {
// //         type: Number, default: 0
// //     },
// //     resetOtp: {
// //         type: String, default: "",
// //     },
// //     resetOtpExpireAt: {
// //         type: Number, default: 0
// //     },
// //     profileImage: {
// //       type: String, default: "",
// //     },
// //     gender: {
// //       type: String,
// //       enum: ["male", "female"],
// //       default: "male",
// //     },
// //     age: {
// //       type: Number, default: 0,
// //     },
// //     height: {
// //       type: Number, default: 0,
// //     },
// //     heightUnit: {
// //       type: String, default: "cm", // cm or inch
// //     },
// //     weight: {
// //       type: Number, default: 0,
// //     },
// //     weightUnit: {
// //       type: String, default: "kg", // kg or lb
// //     },
// //     bio: {
// //       type: String,
// //       default: "Fitness enthusiast & Professional skater",
// //     },


// //     // for water intake purpose
// //     target: {
// //       type: Number, default: 2000,
// //     },
// //     burnTarget: {
// //       type: Number,
// //       default: 500, // default daily burn target
// //     },
// //     // ...existing code...
// //     mealCalorieTarget: {
// //       type: Number,
// //       default: 2000, // Default daily meal calorie intake target
// //     },
// //     stepGoal : {
// //       type: Number,
// //       default: 7000, // Default daily step goal
// //     },
// //     // ...existing code...
// //     mealFlag: {
// //       type: Boolean,
    
// //       default: false,
// //     },
// //     burnFlag: {
// //       type: Boolean,
// //       default: false,
// //     },

// // // ...existing code...
// // // ...existing code...

// //     // --- ADDED MEAL TIMES HERE ---
// //     mealTimes: {
// //       breakfast: {
// //         type: String,
// //         default: "07:00"
// //       },
// //       dinner: {
// //         type: String,
// //         default: "19:30"
// //       },
// //       lunch: {
// //         type: String,
// //         default: "12:00"
// //       },
// //       snack: {
// //         type: String,
// //         default: "16:30"
// //       }
// //     }

// //   },
// //   { timestamps: true }
// // );

// // // hash password before saving user to db
// // userSchema.pre("save", async function (next) {
// //   if (!this.isModified("password")) return next();

// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);

// //   next();
// // });

// // // compare password func
// // userSchema.methods.comparePassword = async function (userPassword) {
// //   return await bcrypt.compare(userPassword, this.password);
// // };

// // // const User = mongoose.model("User", userSchema);
// // const User = mongoose.models.User || mongoose.model("User", userSchema);

// // export default User;





















// //   //   // ... your existing fields
// //   // dailyTargets: {
// //   //   water: { type: Number, default: 2000 },
// //   //   steps: { type: Number, default: 10000 },
// //   //   caloriesEarn: { type: Number, default: 2000 },
// //   //   caloriesBurn: { type: Number, default: 500 }
// //   // },
// //   // targetProgress: {
// //   //   water: { type: Number, default: 0 },
// //   //   steps: { type: Number, default: 0 },
// //   //   caloriesEarn: { type: Number, default: 0 },
// //   //   caloriesBurn: { type: Number, default: 0 },
// //   //   date: { type: Date, default: Date.now }
// //   // },
// //   // targetHistory: [{
// //   //   date: { type: Date, required: true },
// //   //   targets: {
// //   //     water: { type: Number, default: 2000 },
// //   //     steps: { type: Number, default: 10000 },
// //   //     caloriesEarn: { type: Number, default: 2000 },
// //   //     caloriesBurn: { type: Number, default: 500 }
// //   //   },
// //   //   progress: {
// //   //     water: { type: Number, default: 0 },
// //   //     steps: { type: Number, default: 0 },
// //   //     caloriesEarn: { type: Number, default: 0 },
// //   //     caloriesBurn: { type: Number, default: 0 }
// //   //   },
// //   //   completed: {
// //   //     water: { type: Boolean, default: false },
// //   //     steps: { type: Boolean, default: false },
// //   //     caloriesEarn: { type: Boolean, default: false },
// //   //     caloriesBurn: { type: Boolean, default: false }
// //   //   },

// //   // }]