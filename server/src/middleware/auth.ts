import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AccessDeniedError, CustomError } from "../errors/CustomError.js";

// type requestData = {
//   user: string;
// };

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token)
    throw new AccessDeniedError(
      "User must be logged in to perform this action."
    );

  try {
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
    if (typeof decoded === "string") {
      return next(new AccessDeniedError("Invalid token payload."));
    }
    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    if (error instanceof CustomError) return next(error);
    else return next(new AccessDeniedError("Invalid token."));
  }
};
