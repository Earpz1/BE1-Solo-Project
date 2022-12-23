import { body, checkSchema, validationResult } from 'express-validator'
export const reviewSchema = {
  comment: {
    notEmpty: true,
    errorMessage: 'Comments cannot be empty',
  },
  rate: {
    notEmpty: true,
    errorMessage: 'Rating cannot be empty',
  },
}
