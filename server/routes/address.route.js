import { Router } from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { 
    addNewAddressController, 
    deleteAddressController, 
    getAllAddressByIdController, 
    updateAddressController
} from "../controllers/address.controller.js"

const addressRoutes = Router()

addressRoutes.post("/add-new-address", authMiddleware, addNewAddressController)
addressRoutes.get("/get-address", authMiddleware, getAllAddressByIdController)
addressRoutes.put("/update-address", authMiddleware, updateAddressController)
addressRoutes.delete("/delete-address", authMiddleware, deleteAddressController)

export default addressRoutes