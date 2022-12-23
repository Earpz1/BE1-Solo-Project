import express, { response } from 'express'
import fs, { write } from 'fs'
import uniqid from 'uniqid'
import httpErrors from 'http-errors'
import multer from 'multer'
import {
  getProducts,
  saveProductImage,
  writeProducts,
  getReviews,
  writeReview,
} from '../lib/file-funcs.js'
import { checkSchema, validationResult } from 'express-validator'
import { productSchema } from './validator.js'
import { reviewSchema } from '../reviews/validator.js'

const productsRouter = express.Router()

//Get all products and filter them if price is less than X (use ?price=X)
productsRouter.get('/', async (request, response, next) => {
  try {
    const productsFile = await getProducts()
    let products = null
    if (request.query.price) {
      products = productsFile.filter(
        (product) => product.price < request.query.price,
      )
    } else {
      products = productsFile
    }
    response.send(products)
  } catch (error) {
    next(error)
  }
})

//Get product by ID

productsRouter.get('/:id', async (request, response, next) => {
  try {
    const productsFile = await getProducts()
    const productID = request.params.id

    const singleProduct = productsFile.find(
      (products) => products._id === productID,
    )
    response.status(200).send(singleProduct)
  } catch (error) {
    next(error)
  }
})

//Post a new Product

productsRouter.post(
  '/',
  checkSchema(productSchema),
  async (request, response, next) => {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      })
    }

    try {
      console.log(request.body)
      const newProduct = {
        _id: uniqid(),
        ...request.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const productsFile = await getProducts()

      productsFile.push(newProduct)
      await writeProducts(productsFile)
      response.status(201).send(newProduct)
    } catch (error) {
      next(error)
    }
  },
)

//Delete product from ID

productsRouter.delete('/:id', async (request, response, next) => {
  try {
    const productsFile = await getProducts()
    const productID = request.params.id

    const newProducts = productsFile.filter(
      (products) => products._id !== productID,
    )

    await writeProducts(newProducts)
    response.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Edit a post from ID
productsRouter.put('/:id', async (request, response, next) => {
  try {
    const productsFile = await getProducts()
    const productID = request.params.id

    const oldProductIndex = productsFile.findIndex(
      (product) => product._id === productID,
    )
    const oldProduct = productsFile[oldProductIndex]
    const newProduct = { ...oldProduct, ...request.body, updatedAt: new Date() }

    productsFile[oldProductIndex] = newProduct
    await writeProducts(productsFile)
    response.send(newProduct)
  } catch (error) {}
})

productsRouter.post(
  '/:id/upload',
  multer().single('productImage'),
  async (request, resposne, next) => {
    try {
      const fileName = request.params.id + '.gif'
      const URL = 'http://localhost:3001/img/products/' + fileName
      await saveProductImage(fileName, request.file.buffer)

      const productsFile = await getProducts()
      const id = request.params.id

      const productIndex = productsFile.findIndex(
        (products) => products._id === id,
      )

      if (productIndex !== -1) {
        const product = productsFile[productIndex]
        const newProduct = { ...product, imageUrl: URL, updatedAt: new Date() }

        productsFile[productIndex] = newProduct
        await writeProducts(productsFile)
      }
      response.send('Image uploaded')
    } catch (error) {
      next(error)
    }
  },
)

//Add a new review

productsRouter.post(
  '/:id/review',
  checkSchema(reviewSchema),
  async (request, response, next) => {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      })
    }
    try {
      const reviewFile = await getReviews()
      const newReview = {
        _id: uniqid(),
        ...request.body,
        productId: request.params.id,
        createdAt: new Date(),
      }
      reviewFile.push(newReview)
      await writeReview(reviewFile)
      response.status(201).send(newReview)
    } catch (error) {
      next(error)
    }
  },
)

//Get all reviews for a specific product
productsRouter.get('/:productId/reviews', async (request, response, next) => {
  try {
    const reviews = await getReviews()
    const productID = request.params.productId

    const filteredReviews = reviews.filter(
      (review) => review.productId === productID,
    )
    response.status(200).send(filteredReviews)
  } catch (error) {
    next()
  }
})

//Get a specific review for a specific product
productsRouter.get(
  '/:productId/reviews/:reviewId',
  async (request, response, next) => {
    try {
      const reviews = await getReviews()
      const productID = request.params.productId
      const reviewID = request.params.reviewId

      const filteredReviews = reviews.filter(
        (review) => review.productId === productID && review._id === reviewID,
      )
      response.status(200).send(filteredReviews)
    } catch (error) {
      next()
    }
  },
)

//Delete a specific review for a specific product

productsRouter.delete(
  '/:productId/reviews/:reviewId',
  async (request, response, next) => {
    try {
      const reviews = await getReviews()
      const productID = request.params.productId
      const reviewID = request.params.reviewId

      const newArray = reviews.filter(
        (reviews) =>
          reviews.productId !== productID && reviews._id !== reviewID,
      )

      await writeReview(newArray)
      response.status(200).send()
    } catch (error) {
      next()
    }
  },
)

//Edit specific product review with both ID's
productsRouter.put(
  '/:productId/reviews/:reviewId',
  async (request, response, next) => {
    try {
      const reviewsFile = await getReviews()
      const productID = request.params.productId
      const reviewID = request.params.reviewId

      const reviewIndex = reviewsFile.findIndex(
        (review) => review.productId === productID && review._id === reviewID,
      )
      const oldReview = reviewsFile[reviewIndex]
      const newReview = { ...oldReview, ...request.body }

      reviewsFile[reviewIndex] = newReview
      await writeReview(reviewsFile)

      response.status(200).send(newReview)
    } catch (error) {
      console.log(error)
      next()
    }
  },
)

export default productsRouter
