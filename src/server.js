import express from 'express'
import { join } from 'path'
import cors from 'cors'
import { genericError, NotFoundError } from './errors.js'
import productsRouter from '../products/index.js'
import reviewsRouter from '../reviews/index.js'
import { checkJSON } from '../lib/middleware.js'

const server = express()
const port = 3001
const publicFolder = join(process.cwd(), './public')

server.get('/', (request, response) => {
  response.send('Successful connection')
})

//Middleware
server.use(express.static(publicFolder))
server.use(cors())
server.use(express.json())

//Endpoints
server.use('/products', productsRouter)
server.use('/reviews', reviewsRouter)

//Error handling

server.use(NotFoundError)
server.use(genericError)

server.listen(port, () => {
  console.log('The server is running on port', port)
})
