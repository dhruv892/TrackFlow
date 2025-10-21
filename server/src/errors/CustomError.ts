type ErrorName =
	"NotFoundError" |
	"ValidationError" |
	"InternalServerError" |
	"ConflictError" |
	"AccessDenied"

export class CustomError extends Error {
	statusCode: number;
	name: string;

	constructor(statusCodeOrMessage: number, message: string, name: ErrorName) {
		super(message);
		this.statusCode = statusCodeOrMessage;
		this.name = name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(404, message, "NotFoundError");
	}
}

export class AccessDeniedError extends CustomError {
	constructor(message: string) {
		super(404, message, "AccessDenied");
	}
}

export class ValidationError extends CustomError {
	constructor(message: string) {
		super(400, message, "ValidationError");
	}
}

export class InternalServerError extends CustomError {
	constructor(message: string) {
		super(500, message, "InternalServerError");
	}
}

export class ConflictError extends CustomError {
	constructor(message: string) {
		super(409, message, "ConflictError");
	}
}
