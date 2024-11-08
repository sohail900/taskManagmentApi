import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../model/userModel'
import { caching } from '../caching/caching'
import { generateOtp } from '../utils/generateOtp'
import { ErrorHandler } from '../handler/errorHandler'
import { sendOtpEmail } from '../services/emailServices'

// generate JWT tokens
const generateToken = (key: string, expireTime: string) =>
    jwt.sign({ id: key }, process.env.JWT_SECRET!, { expiresIn: expireTime })

/// Register user controller
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
        // we check if otpStatus is pending or success
        if (user.otpStatus === 'pending') {
            const token = generateToken(user._id as any, '5m')
            return resp
                .cookie('otpToken', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 5,
                })
                .redirect('http://localhost:3000/api/v1/verify-otp')
        }
        return next(new ErrorHandler(400, `Email already exists `))
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
        const token = generateToken(newUser._id as any, '5m')
        return resp
            .status(201)
            .cookie('otpToken', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 5,
            })
            .redirect('http://localhost:3000/api/v1/verify-otp')
    } catch (error: any) {
        console.log(error.message)
        next(new ErrorHandler(500, 'Failed to create user'))
    }
}

// Verify otp controller
const verifyOtpController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { otp } = req.body
    const { otpToken } = req.cookies
    // Validate otp and otpToken
    if (!otp) return next(new ErrorHandler(400, 'Otp is required'))
    if (!otpToken) return next(new ErrorHandler(400, 'Otp token not found...'))
    // Verify OTP Token
    const cachedOtp = await caching.getOtp()

    if (cachedOtp !== otp) return next(new ErrorHandler(400, 'Invalid OTP'))
    // Verify user
    try {
        const decode: any = jwt.verify(otpToken, process.env.JWT_SECRET as any)
        const userData = await UserModel.findById({ _id: decode.id })
        if (userData) {
            const authToken = generateToken((userData as any)._id, '10m')
            const refreshAuthToken = generateToken((userData as any)._id, '20m')
            userData.otpStatus = 'success'
            await userData.save()
            resp.cookie('authToken', authToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 10,
            })
            resp.cookie('refreshToken', refreshAuthToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 20,
            })
            resp.status(200).json({
                success: true,
                message: 'Successfully register and login',
            })
        }
    } catch (error) {
        return next(
            new ErrorHandler(401, 'Invalid Otp token, please try again...')
        )
    }
}
// Refresh token controller
const refreshTokenController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { refreshToken } = req.cookies
    if (!refreshToken)
        return next(new ErrorHandler(400, 'Refresh token not found..'))
    try {
        const decode: any = jwt.verify(refreshToken, process.env.JWT_SECRET!)
        const userDetails = await UserModel.findById({ _id: decode.id })
        const authToken = generateToken(userDetails?.id, '10m')
        resp.cookie('authToken', authToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 10,
        })
    } catch (error) {
        return next(new ErrorHandler(401, 'Invalid refresh token'))
    }
}
export const userController = {
    registerController,
    verifyOtpController,
    refreshTokenController,
}
