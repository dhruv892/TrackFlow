type ErrorName =
	"NotFoundError" |
	"ValidationError" |
	"InternalServerError" |
	"CustomError"

export class CustomError extends Error {
	statusCode: number;
	name: string;

	constructor(statusCodeOrMessage: string | number, message?: string, name: ErrorName = "InternalServerError") {
		if (typeof statusCodeOrMessage === 'number') {
			super(message);
			this.statusCode = statusCodeOrMessage;
			this.name = name;
		} else {
			super(statusCodeOrMessage);
			this.statusCode = 500;
			this.name = "InternalServerError";
		}
	}
}


