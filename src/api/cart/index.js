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
      response.status(200).send(cart)
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

export default cartRouter
