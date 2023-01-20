export const checkJSON = (request, response, next) => {
  if (request.headers['content-type'] !== 'application/json') {
    response.status(400).send('Your content type must be JSON')
  } else {
    next()
  }
}
