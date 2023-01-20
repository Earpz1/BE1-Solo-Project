import mongoose from 'mongoose'

const { Schema, model } = mongoose

const reviewSchema = new Schema({
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
})

export default model('reviewsModel', reviewSchema)
