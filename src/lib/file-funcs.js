import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs-extra'

const { readJSON, writeJSON, writeFile } = fs

const dataFolder = join(dirname(fileURLToPath(import.meta.url)), '../../data')
const productsJSON = join(dataFolder, 'products.json')
const reviewsJSON = join(dataFolder, 'reviews.json')
const productsImageFolder = join(process.cwd(), './public/img/products')

export const getProducts = () => readJSON(productsJSON)
export const writeProducts = (newProduct) => writeJSON(productsJSON, newProduct)

export const getReviews = () => readJSON(reviewsJSON)
export const writeReview = (newReview) => writeJSON(reviewsJSON, newReview)

export const saveProductImage = (fileName, buffer) =>
  writeFile(join(productsImageFolder, fileName), buffer)
