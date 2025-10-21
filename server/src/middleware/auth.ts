import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccessDeniedError, CustomError } from "../errors/CustomError.js";

type requestData = {
	user: string
}
export const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token)
		throw new AccessDeniedError("User must be logged in to perform this action.")

	try {
		const decoded = jwt.verify(token, String(process.env.JWT_SECRET))
		req.user = decoded;
		next();
	} catch (error) {
		if (error instanceof CustomError)
			return next(error);
		else
			return next(new AccessDeniedError("Invalid token."))
	}
}
