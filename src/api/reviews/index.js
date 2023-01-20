import express, { response } from 'express'
import createHttpError from 'http-errors'
import { writeReview, getReviews } from '../../lib/file-funcs.js'
import reviewsModel from './model.js'

const reviewsRouter = express.Router()

//Post a new review

reviewsRouter.post('/', async (request, response, next) => {
  try {
    const newReview = new reviewsModel(request.body)
    const { _id } = await newReview.save()

    if (newReview) {
      response.status(200).send({ _id })
    }
  } catch (error) {
    next(error)
  }
})

//Get all reviews

reviewsRouter.get('/', async (request, response, next) => {
  try {
    const reviews = await reviewsModel.find({})
    response.status(200).send(reviews)
  } catch (error) {
    next(error)
  }
})

//Get specific review using ID otherwise return an error
reviewsRouter.get('/:id', async (request, response, next) => {
  try {
    const review = await reviewsModel.findById(request.params.id)

    if (review) {
      response.status(200).send(review)
    } else {
      next(
        createHttpError(
          404,
          `No review with that ID was found in the database`,
        ),
      )
    }
  } catch (error) {
    next(error)
  }
})

//Delete a review and send an error message if no review with that ID was found

reviewsRouter.delete('/:id', async (request, response, next) => {
  try {
    const review = await reviewsModel.findByIdAndDelete(request.params.id)

    if (review) {
      response.status(200).send(`Review has been deleted`)
    } else {
      next(
        createHttpError(
          404,
          `Unable to delete review, no review with ID ${request.params.id} was found`,
        ),
      )
    }
  } catch (error) {
    next()
  }
})

export default reviewsRouter
