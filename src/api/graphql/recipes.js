import { gql } from '@apollo/client/core/index.js'

export const RECIPE_FIELDS = gql`
  fragment RecipeFields on Recipe {
    id
    title
    ingredientAmounts {
      ingredient
      amountQuantity
      amountUnit
    }
    instructions
    tags
    likes
    updatedAt
    createdAt
    author {
      username
    }
  }
`

export const GET_RECIPES = gql`
  ${RECIPE_FIELDS}
  query getRecipes($options: RecipesOptions) {
    recipes(options: $options) {
      ...RecipeFields
    }
  }
`

export const GET_RECIPES_BY_AUTHOR = gql`
  ${RECIPE_FIELDS}
  query getRecipesByAuthor($author: String!, $options: RecipesOptions) {
    recipesByAuthor(username: $author, options: $options) {
      ...RecipeFields
    }
  }
`

export const CREATE_RECIPE = gql`
  mutation createRecipe(
    $title: String!
    $ingredientAmounts: [IngredientAmountInput!]!
    $instructions: String
    $tags: [String!]
  ) {
    createRecipe(
      title: $title
      ingredientAmounts: $ingredientAmounts
      instructions: $instructions
      tags: $tags
    ) {
      id
      title
    }
  }
`

export const LIKE_RECIPE = gql`
  mutation likeRecipe($id: ID!) {
    likeRecipe(id: $id) {
      id
      likes
    }
  }
`
