// server/graphql/recipe.js
import { User } from '../db/models/user.js'

export const recipeSchema = `#graphql
  type IngredientAmount {
    ingredient: String!
    amountQuantity: Float!   # or Int! if you prefer
    amountUnit: String!
  }

  type Recipe {
    id: ID!
    title: String!
    ingredientAmounts: [IngredientAmount!]!
    instructions: String
    tags: [String!]
    likes: Int!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  input IngredientAmountInput {
    ingredient: String!
    amountQuantity: Float!
    amountUnit: String!
  }
`

export const recipeResolver = {
  Recipe: {
    // resolve the author ObjectId into a User document
    author: async (recipe) => {
      return await User.findById(recipe.author)
    },
  },
}
