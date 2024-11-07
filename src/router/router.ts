import { Router } from 'express'
import { ErrorHandler } from '../handler/erroHandler'
const router = Router()

router.route('/').get((req, res) => {
    res.send('first route')
})
export default router
