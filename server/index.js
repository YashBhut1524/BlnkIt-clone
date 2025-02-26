import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helemet from "helmet"
import connectDB from "./config/connectDB.js"
import userRoutes from "./routes/user.route.js"
import categoryRoutes from "./routes/category.route.js"
import imageRoutes from "./routes/image.route.js"
import subCategoryRoutes from "./routes/subCetegory.route.js"

dotenv.config()

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helemet({
    crossOriginResourcePolicy: false,
}))

const PORT = 8080 || process.env.PORT

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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
})

