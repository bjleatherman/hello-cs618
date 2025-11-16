// server/graphql/index.js
import { querySchema, queryResolver } from './query.js'
import { postSchema, postResolver } from './post.js'
import { userSchema, userResolver } from './user.js'
import { mutationSchema, mutationResolver } from './mutation.js'
import { recipeSchema, recipeResolver } from './recipe.js' // ⬅️ new

export const typeDefs = [
  querySchema,
  postSchema,
  userSchema,
  recipeSchema,
  mutationSchema,
]

export const resolvers = [
  queryResolver,
  postResolver,
  userResolver,
  recipeResolver,
  mutationResolver,
]
