import { Router } from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { 
    addNewAddressController, 
    getAllAddressByIdController, 
    updateAddressController
} from "../controllers/address.controller.js"

const addressRoutes = Router()

addressRoutes.post("/add-new-address", authMiddleware, addNewAddressController)
addressRoutes.get("/get-address", authMiddleware, getAllAddressByIdController)
addressRoutes.put("/update-address", authMiddleware, updateAddressController)

export default addressRoutes