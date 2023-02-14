export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
export class UnAuthenticatedError extends BadRequestError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export class NotFoundError extends BadRequestError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
export class UnAuthorizedError extends NotFoundError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
export class InternalServerError extends UnAuthorizedError {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
