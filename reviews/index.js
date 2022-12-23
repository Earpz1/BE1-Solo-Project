import express, { response } from 'express'
import fs, { write } from 'fs'
import uniqid from 'uniqid'
import httpErrors from 'http-errors'
import { writeReview, getReviews } from '../lib/file-funcs.js'

const reviewsRouter = express.Router()

//Get all reviews

reviewsRouter.get('/', async (request, response, next) => {
  try {
    const reviewFile = await getReviews()
    response.status(200).send(reviewFile)
  } catch (error) {
    next(error)
  }
})

//Get specific review using ID
reviewsRouter.get('/:id', async (request, response, next) => {
  try {
    const reviewFile = await getReviews()
    const id = request.params.id

    const singleReview = reviewFile.find((reviews) => reviews._id === id)
    response.status(200).send(singleReview)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.delete('/:id', async (request, response, next) => {
  try {
    const reviewFile = await getReviews()
    const id = request.params.id

    const removeReview = reviewFile.filter((reviews) => reviews._id !== id)

    await writeReview(removeReview)
    response.status(200).send()
  } catch (error) {
    next()
  }
})

export default reviewsRouter
