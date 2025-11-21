import mongoose, { Schema } from 'mongoose'
const notificationSchema = new Schema({
  title: { type: String, required: true },
  url: { type: Date, expires: 5 * 60, default: Date.now, required: true },
})
export const Message = mongoose.model('message', notificationSchema)
