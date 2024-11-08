import redis from 'redis'

const client = redis.createClient()

client.on('error', () => {
    console.log('failed to connect')
})
await client.connect()

/// STORED OTP TO MEMORY
async function storeOtp(value: number) {
    await client.set('otpValue', value, { EX: 60 * 5 })
}
/// GET OTP FROM MEMORY
async function getOtp() {
    return await client.get('otpValue')
}

export const caching = {
    storeOtp,
    getOtp,
}
