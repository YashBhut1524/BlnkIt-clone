import {Router} from "express"
import { loginUserController, logoutController, registerUserController, verifyUserController } from "../controllers/user.controller.js"
import authMiddleware from "../middleware/authmiddleware.js"

const userRoutes = Router()

userRoutes.post("/register", registerUserController)
userRoutes.post("/verify-email", verifyUserController)
userRoutes.post("/login", loginUserController)
userRoutes.get("/logout", authMiddleware, logoutController)

export default userRoutes