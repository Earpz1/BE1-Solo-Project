import express from 'express'
import { join } from 'path'
import cors from 'cors'
import { genericError, NotFoundError } from './errors.js'
import productsRouter from '../src/api/products/index.js'
import reviewsRouter from '../src/api/reviews/index.js'
import cartRouter from '../src/api/cart/index.js'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'

const server = express()
const port = process.env.PORT
const publicFolder = join(process.cwd(), './public')

server.get('/', (request, response) => {
  response.send('Successful connection')
})

const whitelist = [process.env.FE_PROD_URL, process.env.BE_PROD_URL]

//Middleware
server.use(express.static(publicFolder))

server.use(
  cors({
    origin: (origin, corsNext) => {
      console.log('Origin: ', origin)

      if (!origin || whitelist.indexOf(origin) !== -1) {
        corsNext(null, true)
      } else {
        corsNext(createHttpError(400, `Cors Errors!`))
      }
    },
  }),
)

server.use(express.json())

//Endpoints
server.use('/products', productsRouter)
server.use('/reviews', reviewsRouter)
server.use('/cart', cartRouter)

//Error handling

server.use(NotFoundError)
server.use(genericError)

//Connect to the Database
mongoose.connect(process.env.MONGO_DB_URL)

mongoose.connection.on('connected', () => {
  server.listen(port, () => {
    console.log(
      'The server is running on port',
      process.env.PORT,
      'and the database is connected',
    )
  })
})
