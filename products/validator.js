import { body, checkSchema, validationResult } from 'express-validator'
export const productSchema = {
  name: {
    notEmpty: true,
    errorMessage: 'Name cannot be empty',
  },
  price: {
    notEmpty: true,
    errorMessage: 'Price cannot be empty',
  },
  descrption: {
    notEmpty: true,
    errorMessage: 'Descrption cannot be empty',
  },
  brand: {
    notEmpty: true,
    errorMessage: 'Brand cannot be empty',
  },
  category: {
    notEmpty: true,
    errorMessage: 'Category cannot be empty',
  },
}
