import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});


const Meal = mongoose.model('Meal', mealSchema);
// console.log('Meals schema is  working');

export default Meal;