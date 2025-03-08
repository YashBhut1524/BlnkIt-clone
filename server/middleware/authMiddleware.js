import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1] // "Bearer token" => ["Bearer","token"]
        // console.log("token", token);
        
        if(!token) {
            return res.status(401).json({
                message: "You are not logged in. Please log in to continue.",
                error: true, 
                success: false
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        // console.log("Decode: ", decode);
        if(!decode) {
            return res.status(401).json({
                message: "Unauthorized access!!!",
                error: true,
                success: false
            })
        }

        req.userId = decode.id
        // console.log("req.userId:", req.userId);
        
        next()

    } catch (error) {
        return res.status(500).json({
            message: "You are not logged in. Please log in to continue.",
            erros: true,
            success: false
        })
    }
}

export default authMiddleware