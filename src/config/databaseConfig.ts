import mongoose from 'mongoose'
import { ErrorHandler } from '../handler/errorHandler'
mongoose
    .connect('mongodb://localhost:27017/task_management')
    .then(() => {
        console.log('Database connected')
    })
    .catch((err) => {
        console.log(err)
        throw new ErrorHandler(500, 'Database connection failed')
    })
