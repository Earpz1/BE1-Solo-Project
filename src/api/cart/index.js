import cartModel from './model.js'
import express from 'express'
import createHttpError from 'http-errors'

const cartRouter = express.Router()

cartRouter.post('/', async (request, response, next) => {
  try {
    const newCart = new cartModel(request.body)

    if (newCart) {
      const { _id } = await newCart.save()
      response.status(200).send({ _id })
    }
  } catch (error) {
    next(error)
  }
})

cartRouter.get('/', async (request, response, next) => {
  try {
    const carts = await cartModel.find({})
    response.status(200).send(carts)
  } catch (error) {
    next(error)
  }
})

cartRouter.get('/:cartID', async (request, response, next) => {
  try {
    const cart = await cartModel.findById(request.params.cartID).populate({
      path: 'products',
    })

    if (cart) {
      response.status(200).send(cart.toObject())
    } else {
      next(
        createHttpError(
          404,
          `Cart with the ID ${request.params.cartID} is not found`,
        ),
      )
    }
  } catch (error) {
    next(error)
  }
})

cartRouter.put('/:cartID/:productID', async (request, response, next) => {
  try {
    const product = await cartModel.findByIdAndUpdate(
      '63ca8744c8f0e1eeb1d66f44',
      { $push: { products: { _id: request.params.productID } } },
      { new: true, runValidators: true },
    )

    if (product) {
      response.status(200).send(product)
    }
  } catch (error) {
    next(error)
  }
})

export default cartRouter
