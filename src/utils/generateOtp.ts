import { randomInt } from 'crypto'
export const generateOtp = () => {
    return randomInt(100000, 900000)
}
