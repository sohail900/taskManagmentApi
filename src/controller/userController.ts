import type { NextFunction, Request, Response } from 'express'
import UserModel from '../model/userModel'
import { caching } from '../caching/caching'
import { generateOtp } from '../utils/generateOtp'
import { ErrorHandler } from '../handler/errorHandler'
import { sendOtpEmail } from '../services/emailServices'

/// Register controller
const registerController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { email, password, fullname } = req.body

    if (!email || !password || !fullname) {
        return next(new ErrorHandler(400, 'All fields are required'))
    }
    const user = await UserModel.findOne({ email })
    if (user) {
        return next(new ErrorHandler(400, 'Email already exists'))
    }
    try {
        const hashPassword = await Bun.password.hash(password)
        const newUser = await UserModel.create({
            email,
            password: hashPassword,
            fullname,
            otpStatus: 'pending',
        })
        const otp = generateOtp()
        sendOtpEmail(email, otp)

        // save otp in memory (cache)
        await caching.storeOtp(otp)

        // send response
        return resp.status(201).json({
            success: true,
            message: 'Otp sent successfully',
            data: newUser,
        })
    } catch (error: any) {
        console.log(error.message)
        next(new ErrorHandler(500, 'Failed to create user'))
    }
}
export const apiController = {
    registerController,
}
