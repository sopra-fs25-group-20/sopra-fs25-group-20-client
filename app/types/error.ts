export class ApplicationError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApplicationError";
    this.status = status;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
