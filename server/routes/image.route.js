import {Router} from "express"
import { deleteImageController, uploadImageController } from "../controllers/Image.controller.js"
import upload from "../middleware/multer.js"
import authMiddleware from "../middleware/authmiddleware.js"

const imageRoutes = Router()

imageRoutes.post("/upload-image", authMiddleware, upload.single("image"),uploadImageController)
imageRoutes.post("/delete-image", authMiddleware, deleteImageController)

export default imageRoutes