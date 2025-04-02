export class ApplicationError extends Error {
  status: number;
  info: string;

  constructor(status: number, info: string) {
    super(info);
    this.name = "ApplicationError";
    this.status = status;
    this.info = info;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
