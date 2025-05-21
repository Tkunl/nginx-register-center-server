import { HttpException } from '@nestjs/common'
import { DockerException } from '../types/docker-exception'

function isValidationException(error: Error): error is HttpException {
  return error instanceof HttpException && error.stack?.includes('ValidationPipe') === true
}

function isDockerException(error: Error): error is DockerException {
  return error.message.includes('(HTTP code')
}

export { isValidationException, isDockerException }
