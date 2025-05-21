export type DockerException = Error & {
  reason: string
  message: string
  statusCode: number
  json: { message: string }
}
