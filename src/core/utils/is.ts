import { HttpException } from '@nestjs/common'

function isValidationException(error: Error): error is HttpException {
  return error instanceof HttpException && error.stack?.includes('ValidationPipe') === true
}

export { isValidationException }
