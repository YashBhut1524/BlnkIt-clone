import {Router} from "express"
import { forgotPasswordController, loginUserController, logoutController, registerUserController, updateUserDetailsController, uploadAvatar, verifyUserController } from "../controllers/user.controller.js"
import authMiddleware from "../middleware/authmiddleware.js"
import upload from "../middleware/multer.js"

const userRoutes = Router()

userRoutes.post("/register", registerUserController)
userRoutes.post("/verify-email", verifyUserController)
userRoutes.post("/login", loginUserController)
userRoutes.get("/logout", authMiddleware, logoutController)
userRoutes.put("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar)
userRoutes.put("/update-user", authMiddleware, updateUserDetailsController)
userRoutes.put("/forgot-password", forgotPasswordController)

export default userRoutes