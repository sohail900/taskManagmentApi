import { Schema, model } from 'mongoose'
import { password } from 'bun'

const UserSchema = new Schema(
    {
        fullname: {
            type: String,
            required: [true, 'Fullname is required'],
            max: [50, 'Fullname can not be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
        },
        otpStatus: {
            type: String,
            enum: ['pending', 'success'],
            default: 'pending',
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

const UserModel = model('users', UserSchema)

export default UserModel
