import { createTransport } from 'nodemailer'
import { ErrorHandler } from '../handler/errorHandler'

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export async function sendOtpEmail(email: string, otp: number | string) {
    const options = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'VERIFY OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="text-align: center; color: #4CAF50;">Welcome to Our Service</h2>
            <p style="font-size: 16px;">Dear User,</p>
            <p style="font-size: 16px;">
              Thank you for choosing our service. Use the OTP below to complete your login or registration process.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px; background-color: #4CAF50; color: #fff;">${otp}</span>
            </div>
            <p style="font-size: 16px; text-align: center; color: #777;">
              This OTP is valid for 5 minutes. Please do not share it with anyone.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://yourcompany.com" style="text-decoration: none; font-size: 16px; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                Visit Our Website
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777; text-align: center;">
              If you did not request this email, please ignore it.
            </p>
          </div>
        `,
    }
    try {
        await transporter.sendMail(options)
        console.log('successfully send email')
    } catch (error) {
        throw new ErrorHandler(500, 'Failed to send email, please try again')
    }
}
