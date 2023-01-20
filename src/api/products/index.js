import express from 'express'
import productsModel from './model.js'
import createHttpError from 'http-errors'

const productsRouter = express.Router()

//Get all products from the database
productsRouter.get('/', async (request, response, next) => {
  try {
    const products = await productsModel.find({}).limit(request.query.limit)
    response.status(200).send(products)
  } catch (error) {
    next(error)
  }
})

//Get product by ID and return a 404 error if it doesn't exist

productsRouter.get('/:id', async (request, response, next) => {
  try {
    const products = await productsModel.findById(request.params.id).populate({
      path: 'reviews',
    })

    if (products) {
      response.send(products)
    } else {
      next(
        createHttpError(
          404,
          `Product with the ID ${request.params.id} has not been found`,
        ),
      )
    }
  } catch (error) {
    next(error)
  }
})

//Post a new Product

productsRouter.post('/', async (request, response, next) => {
  try {
    const newProduct = new productsModel(request.body)
    const { _id } = await newProduct.save()

    if (newProduct) {
      response.status(200).send({ _id })
    } else {
      next(createHttpError('422', `You have some validation errors`))
    }
  } catch (error) {
    next(error)
  }
})

//Delete product from ID, returning an error message if it is not found

productsRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(
      request.params.id,
    )

    if (deletedProduct) {
      response.status(204).send()
    } else {
      next(
        createHttpError(404, `Product with ${request.params.id} was not found`),
      )
    }
  } catch (error) {
    next(error)
  }
})

//Edit a post from ID, returning an error if validation fails
productsRouter.put('/:id', async (request, response, next) => {
  try {
    const product = await productsModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    )

    if (product) {
      response.status(200).send(product)
    } else {
      next(createHttpError(404, `There was no product with that ID found `))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter
