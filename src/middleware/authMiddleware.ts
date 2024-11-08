import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ErrorHandler } from '../handler/errorHandler'
import UserModel from '../model/userModel'

export const authMiddleware = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    // get cookies
    const { authToken } = req.cookies
    console.log(authToken)
    if (!authToken) return next(new ErrorHandler(400, 'Please login again..'))
    try {
        const decode: any = jwt.verify(authToken, process.env.JWT_SECRET!)
        const userDetails = await UserModel.findById({ _id: decode.id })
        req.id = userDetails?._id
        next()
    } catch (error) {
        return next(new ErrorHandler(401, 'Unauthenticated user...'))
    }
}
