import mongoose from 'mongoose'

export const NotFoundError = (error, request, response, next) => {
  if (error.status === 404 || error instanceof mongoose.Error.CastError) {
    console.log(error)
    response.status(404).send(error.message)
  } else {
    next(error)
  }
}

export const missingFields = (error, request, response, next) => {
  if (error.status === 422 || error instanceof mongoose.Error.ValidationError) {
    console.log(error)
    response.status(422).send(error.message)
  }
}

export const genericError = (error, request, response, next) => {
  console.log(error)
  response.status(500).send({ message: error.message })
}
