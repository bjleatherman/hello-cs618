// backend/src/graphql/mutation.js
import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost } from '../services/posts.js'
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe, // 👈 service function
} from '../services/recipes.js'

export const mutationSchema = `#graphql
type Mutation {
  signupUser(username: String!, password: String!): User
  loginUser(username: String!, password: String!): String

  createPost(
    title: String!
    contents: String
    tags: [String]
  ): Post

  # RECIPES
  createRecipe(
    title: String!
    ingredientAmounts: [IngredientAmountInput!]!
    instructions: String
    tags: [String]
  ): Recipe

  updateRecipe(
    id: ID!
    title: String
    ingredientAmounts: [IngredientAmountInput!]
    instructions: String
    tags: [String]
  ): Recipe

  deleteRecipe(id: ID!): Boolean

  likeRecipe(id: ID!): Recipe
}
`

export const mutationResolver = {
  Mutation: {
    signupUser: async (_parent, { username, password }) => {
      return await createUser({ username, password })
    },

    loginUser: async (_parent, { username, password }) => {
      return await loginUser({ username, password })
    },

    createPost: async (_parent, { title, contents, tags }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          { extensions: { code: 'UNAUTHORIZED' } },
        )
      }
      return await createPost(auth.sub, { title, contents, tags })
    },

    createRecipe: async (
      _parent,
      { title, ingredientAmounts, instructions, tags },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          { extensions: { code: 'UNAUTHORIZED' } },
        )
      }

      return await createRecipe(auth.sub, {
        title,
        ingredientAmounts,
        instructions,
        tags,
      })
    },

    updateRecipe: async (
      _parent,
      { id, title, ingredientAmounts, instructions, tags },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          { extensions: { code: 'UNAUTHORIZED' } },
        )
      }

      return await updateRecipe(auth.sub, id, {
        title,
        ingredientAmounts,
        instructions,
        tags,
      })
    },

    deleteRecipe: async (_parent, { id }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          { extensions: { code: 'UNAUTHORIZED' } },
        )
      }

      const result = await deleteRecipe(auth.sub, id)
      return result.deletedCount > 0
    },

    likeRecipe: async (_parent, { id }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          { extensions: { code: 'UNAUTHORIZED' } },
        )
      }

      const updated = await likeRecipe(id)
      if (!updated) {
        throw new GraphQLError('Recipe not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      return updated
    },
  },
}
