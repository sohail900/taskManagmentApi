import type { NextFunction, Request, Response } from 'express'

// task controller home
const homeController = (req: Request, resp: Response, next: NextFunction) => {
    resp.status(200).json({ message: 'verified user & welcome here..!!!' })
}

export const taskController = {
    homeController,
}
