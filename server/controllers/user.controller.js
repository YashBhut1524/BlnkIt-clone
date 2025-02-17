import {hashPassword,  comparePasswords} from "../helper/passwordHashng.js";
import sendEmail from "../helper/sendEmail.js";
import UserModel from "../models/user.model.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImgCloudinary from "../utils/uploadImgCloudinary.js";
import verificationEmailTemplate from "../utils/verificationEmailTemplate.js";
import dotenv from "dotenv"
import generateOTP from "../utils/generateOTP.js";
import forgotPasswordEmailTemplate from "../utils/forgotPasswordEmailTemplate.js";
import resetPasswordConfirmationTemplate from "../utils/resetPasswordConfirmationTemplate.js";
import jwt from "jsonwebtoken"

dotenv.config();

//register user
export const registerUserController = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                message: "Please fill the required fields!",
                error: true,
                success: false
            });
        }

        const existingUser = await UserModel.findOne({ $or: [{ email }, { mobile }] });

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email 
                    ? "Email is already registered!" 
                    : "Mobile number is already registered!",
                error: true,
                success: false
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        const savedUser = await newUser.save();

        const verifyEmailURL = `${process.env.CLIENT_URL}/verify-email?code=${savedUser._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Verification Email from BlinkIt-Clone",
            html: verificationEmailTemplate({
                name: savedUser.name,
                url: verifyEmailURL,
            }),
        });

        // Auto-login after successful registration
        const accessToken = await generateAccessToken(savedUser._id);
        const refreshToken = await generateRefreshToken(savedUser._id);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.cookie("accessToken", accessToken, cookiesOption);
        res.cookie("refreshToken", refreshToken, cookiesOption);

        return res.status(201).json({
            message: "User registered successfully and logged in.",
            error: false,
            success: true,
            data: {
                user: savedUser,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error("Error in registerUserController:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: true,
            success: false
        });
    }
};

//verify user
export const verifyUserController = async (req, res) => {
    try {
        const { code } = req.body;

        // Find and update the user's email verification status
        const user = await UserModel.findOneAndUpdate(
            { _id: code },
            { $set: { verify_email: true } },
        );

        if (!user) {
            return res.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false,
            });
        }

        // Respond with success message
        return res.status(200).json({
            message: "Email verified successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

//login user
export const loginUserController = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({email})

        if(!user) {
            return res.status(400).json({
                message: "User not registered with this email!",
                error: true,
                success: false
            })
        }

        if(user.status !== "Active") {
            return res.satus(400).json({
                message: `Your account is ${user.status}, Please contact to admin!`,
                error: true,
                success: false
            })
        }

        const isPasswordMatch = await comparePasswords(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid credentials! Please check your email or password.",
                error: true,
                success: false,
            });
        }
        
        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken',accessToken,cookiesOption)
        res.cookie('refreshToken',refreshToken,cookiesOption)

        return res.status(200).json({
            message: "Login successfully.",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

//Logout user
export const logoutController = async (req, res) => {
    try {

        
        const userId = req.userId //from middleware
        // console.log("userId: ", userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken", cookiesOption)
        res.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, 
            {
                refresh_token: ""
            })

        return res.status(200).json({
            message: "Logged out successfully.",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success: false
        })
    }
}

//upload user avatar
export const uploadAvatar = async (req, res) => {
    try {

        const userId = req.userId //from authMiddleware
        const image = req.file //from multer middleware
        // console.log("Image: ", image);

        const upload = await uploadImgCloudinary(image)
        // console.log(upload);

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return res.status(200).json({
            message: "Avatar uploaded successfully",
            data: {
                _id: userId,
                avatar: upload.url
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success: false
        })
    }
}

//update user details
export const updateUserDetailsController = async (req, res) => {
    try {
        
        const userId = req.userId //from authMiddleware
        const {name , email, mobile, password} = req.body

        //check if mobile already exist with other account or not
        if (mobile) {
            const checkMobile = await UserModel.findOne({
                mobile: mobile,
                _id: { $ne: userId }, // Exclude the current user
            });

            if (checkMobile) {
                return res.status(400).json({
                    message: "This mobile number is already associated with another account.",
                    error: true,
                    success: false,
                });
            }
        }

        // Hash the password
        let hashedPassword
        if(password) {
            hashedPassword = await hashPassword(password);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, {
                ...(name && {name: name}),
                ...(email && {email: email}),
                ...(mobile && {mobile: mobile}),
                ...(password && {password: hashedPassword})
            },
            { new: true } // To return the updated user
        )

        return res.status(200).json({
            message: "user details updated successfully.",
            error: false,
            success: true,
            data: updatedUser
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success: false,
        })
    }
}

//forgot password for not login
export const forgotPasswordController = async (req, res) => {
    try {
        const {email} = req.body

        if(!email?.trim()) {
            return res.status(400).json({
                message: "Please provide Email!",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({email})
        if(!user) {
            return res.status(400).json({
                message: "Email does not exist!",
                error: true,
                success: false
            })
        }

        const otp = generateOTP()
        const otpExpireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(otpExpireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot Password from BlinkIt-Clone.",
            html: forgotPasswordEmailTemplate({
                name: user.name, 
                otp: otp
            })
        })

        return res.status(200).json({
            message: "check your Email",
            error: false,
            success: true,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success: false
        })
    }
}

//verify forgot password OTP
export const verifyForgotPasswordOTPController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Please provide both Email and OTP!",
                error: true,
                success: false
            });
        }
        
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email does not exist!",
                error: true,
                success: false
            });
        }

        const currentTime = new Date();

        if (user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "The OTP has expired. Please request a new one to proceed.",
                error: true,
                success: false
            });
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "The OTP you entered is incorrect. Please check and try again.",
                error: true,
                success: false
            });
        }

        // OTP is correct, now reset OTP field to prevent reuse
        await UserModel.updateOne(
            { email },
            { $set: { forgot_password_otp: null, forgot_password_expiry: null } }
        );

        return res.status(200).json({
            message: "OTP verified successfully.",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

//reset the password
export const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Please provide Email and Passwords!",
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match! Please ensure both fields are identical.",
                error: true,
                success: false
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        const updatedUser = await UserModel.findOneAndUpdate(
            { email }, // Find the user by email
            { password: hashedPassword }, // Update the password
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(400).json({
                message: "Email does not exist!",
                error: true,
                success: false
            });
        }

        console.log("updatedUser: ", updatedUser);
        
        await sendEmail({
            sendTo: email,
            subject: "Your Password Has Been Successfully Reset - BlinkItClone",
            html: resetPasswordConfirmationTemplate({
                name: updatedUser.name,
                email: updatedUser.email,
                supportEmail: "support@yashh1524.com"
            })
        })

        return res.status(200).json({
            message: "Password updated successfully.",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

//refresh token controller
export const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1]

        if(!refreshToken) {
            return res.status(400).json({
                message: "Refresh Token not found!",
                error: true,
                success: false
            });
        }

        console.log("refreshToken: ", refreshToken);
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        
        if(!verifyToken) {
            return res.status(400).json({
                message: "Token is expired!",
                error: true,
                success: false
            });
        }

        // console.log("verifyToken: ", verifyToken);
        const userId = verifyToken.id

        const newAccessToken = await generateAccessToken(userId)
        
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        res.cookie("accessToken", newAccessToken, cookiesOption)

        return res.status(200).json({
            message: "New accessToken generated.",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//get login user details 
export const userDetailsController = async (req, res) => {
    try {
        const userId = req.userId

        const user = await UserModel.findById(userId).select("-password -refresh_token")

        if(!user) {
            return res.status(400).json({
                message: "User does not exist!",
                error: true,    
                success: false
            })
        }

        return res.status(200).json({
            message: "user details",
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}