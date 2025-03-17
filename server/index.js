import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet";
import connectDB from "./config/connectDB.js"
import userRoutes from "./routes/user.route.js"
import categoryRoutes from "./routes/category.route.js"
import imageRoutes from "./routes/image.route.js"
import subCategoryRoutes from "./routes/subCetegory.route.js"
import productRouters from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import addressRoutes from "./routes/address.route.js"
import orderRouters from "./routes/order.route.js"

dotenv.config()

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan("dev")); // Logs requests in a readable format
app.use(helmet({ crossOriginResourcePolicy: false }));


const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    //Server to Client
    res.json({
        message: "Server is running at " + PORT
    })
})

app.use("/api/user", userRoutes)
app.use("/api/file", imageRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/sub-category", subCategoryRoutes)
app.use("/api/product", productRouters)
app.use("/api/cart", cartRoutes)
app.use("/api/address", addressRoutes)
app.use("/api/order", orderRouters)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
})

