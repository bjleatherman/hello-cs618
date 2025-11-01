import mongoose, { Schema } from 'mongoose'

// Mongoose Post Schema
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)
export const Post = mongoose.model('post', postSchema)
