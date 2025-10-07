import { Router, type NextFunction, type Response, type Request } from "express";
import bugsRouter from "./bugs.js";
import userRouter from "./users.js";
import commentsRouter from "./comments.js";
import { CustomError } from "../errors/CustomError.js";

const router = Router();

router.use("/bugs", bugsRouter);
router.use("/users", userRouter);
router.use("/comments", commentsRouter)

// Error middleware
router.use((err: CustomError | Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err);

	if (err instanceof CustomError) {
		res.status(err.statusCode).send({
			name: err.name,
			msg: err.message,
			statusCode: err.statusCode,
		});
	} else {
		res.status(500).send({
			name: "InternalServerError",
			msg: err.message || "An unexpected error occurred.",
			statusCode: 500,
		});
	}
});

export default router;
