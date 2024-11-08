import { Router } from 'express'
import { userController } from '../controller/userController'
import { taskController } from '../controller/taskController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.route('/').get(authMiddleware, taskController.homeController)
router.route('/register').post(userController.registerController)
router.route('/verify-otp').put(userController.verifyOtpController)
router.route('/refreshToken').get(userController.refreshTokenController)

export default router
