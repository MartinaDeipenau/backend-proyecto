import { Router } from "express";
import { auth } from '../middleware/auth'
import { allUser } from '../controllers/user.controller'

const adminRouter = Router()
adminRouter.get('/', auth(['admin']), allUser)

export default adminRouter