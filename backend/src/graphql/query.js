// server/graphql/query.js
import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'

import {
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
} from '../services/recipes.js'

export const querySchema = `#graphql
input PostsOptions {
  sortBy: String
  sortOrder: String
}

input RecipesOptions {
  sortBy: String
  sortOrder: String
}

type Query {
  test: String

  # POSTS
  posts(options: PostsOptions): [Post!]!
  postsByAuthor(username: String!, options: PostsOptions): [Post!]!
  postsByTag(tag: String!, options: PostsOptions): [Post!]!
  postById(id: ID!): Post

  # RECIPES
  recipes(options: RecipesOptions): [Recipe!]!
  recipesByAuthor(username: String!, options: RecipesOptions): [Recipe!]!
  recipesByTag(tag: String!, options: RecipesOptions): [Recipe!]!
  recipeById(id: ID!): Recipe
}
`

export const queryResolver = {
  Query: {
    test: () => 'Hello World from GraphQL!',

    // POSTS
    posts: async (_parent, { options }) => listAllPosts(options),
    postsByAuthor: async (_parent, { username, options }) =>
      listPostsByAuthor(username, options),
    postsByTag: async (_parent, { tag, options }) =>
      listPostsByTag(tag, options),
    postById: async (_parent, { id }) => getPostById(id),

    // RECIPES
    recipes: async (_parent, { options }) => listAllRecipes(options),
    recipesByAuthor: async (_parent, { username, options }) =>
      listRecipesByAuthor(username, options),
    recipesByTag: async (_parent, { tag, options }) =>
      listRecipesByTag(tag, options),
    recipeById: async (_parent, { id }) => getRecipeById(id),
  },
}
