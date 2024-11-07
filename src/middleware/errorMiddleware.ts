import type { NextFunction, Response, Request } from 'express'

export function errorMiddleware(
    err: { message: string; statusCode: number },
    req: Request,
    resp: Response,
    next: NextFunction
) {
    err.message = err.message || 'Server failed to response'
    err.statusCode = err.statusCode || 500
    resp.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}
