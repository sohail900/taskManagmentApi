import express from 'express'
import http from 'http'
import router from './router/router'
import { errorMiddleware } from './middleware/errorMiddleware'
const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', router)
app.use(errorMiddleware)
// created http server
const server = http.createServer(app)
server.listen(3000, () => {
    console.log('Server is running on port 3000')
})
