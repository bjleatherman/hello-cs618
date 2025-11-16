import mongoose, { Schema } from 'mongoose'

const ingredientAmountSchema = new Schema({
  ingredient: { type: String, required: true },
  amountQuantity: { type: Number, required: true },
  amountUnit: { type: String, required: true },
})

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    ingredientAmounts: { type: [ingredientAmountSchema], required: true },
    instructions: { type: String, required: false },
    tags: [String],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)
export const Recipe = mongoose.model('recipe', recipeSchema)
