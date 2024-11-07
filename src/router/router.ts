import { Router } from 'express'
import { apiController } from '../controller/userController'
const router = Router()

router.route('/').get((req, res) => {
    res.send('first route')
})
router.route('/register').post(apiController.registerController)
export default router
