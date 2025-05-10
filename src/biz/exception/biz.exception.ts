export class BizException extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message)
    this.name = BizException.name
  }
}
