import { Router } from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { 
    addNewAddressController, 
    getAllAddressByIdController 
} from "../controllers/address.controller.js"

const addressRoutes = Router()

addressRoutes.post("/add-new-address", authMiddleware, addNewAddressController)
addressRoutes.get("/get-address", authMiddleware, getAllAddressByIdController)

export default addressRoutes