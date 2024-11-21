import { NextFunction, Response, Request } from "express";
import ApiError from "../error/error";

export const errorHandler = (
    err: ApiError, 
    _req: Request, 
    res: Response, 
    _next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            error: err.message,
            type: err.errorType,
        });
    } else {
        return res.status(500).json({
            error: "Internal Server Error",
            type: "ServerError",
        });
    }
};