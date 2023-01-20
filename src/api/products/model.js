import mongoose, { SchemaType } from 'mongoose'

const { Schema, model } = mongoose

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageURL: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'reviewsModel' }],
  },
  {
    timestamps: true,
  },
)

export default model('productsModel', productSchema)
