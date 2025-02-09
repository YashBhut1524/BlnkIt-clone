const forgotPasswordEmailTemplate = ({ name, otp }) => {
    return `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 15px; border-radius: 12px; background: #F8CB46; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); color: #333;">
            <!-- Header Section -->
            <div style="text-align: center; padding: 10px;">
                <h1 style="color: #333; font-size: 24px; margin: 0;">Forgot Your Password?</h1>
                <p style="font-size: 14px; color: #555;">No worries, we’re here to help!</p>
                <img 
                    src="https://res.cloudinary.com/do6byjyaw/image/upload/v1739107999/binkeyit/tjhuuywljma5t1oidnzw.png" 
                    alt="Delivery Guy on Scooter" 
                    style="width: 100%; max-width: 280px; border-radius: 10px; margin: 10px 0;"
                >
            </div>
            
            <!-- Content Section -->
            <div style="margin: 15px 0; text-align: center;">
                <p style="font-size: 14px; color: #333;">Dear <strong>${name}</strong>,</p>
                <p style="font-size: 14px; color: #333; line-height: 1.4; margin-bottom: 15px;">
                    We received a request to reset your password. Use the OTP below to proceed with the reset:
                </p>
                <!-- OTP Section -->
                <p style="font-size: 20px; color: #333; font-weight: bold; margin: 20px 0; background: #fff; padding: 10px; border-radius: 8px; display: inline-block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);">
                    ${otp}
                </p>
                <p style="font-size: 14px; color: #333; margin: 15px 0;">This OTP is valid for the next 10 minutes.</p>
            </div>
            
            <!-- Footer Section -->
            <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; text-align: center; font-size: 12px; color: #555;">
                <p>If you did not request a password reset, please ignore this email or contact support immediately.</p>
                <p>Best regards, <br><strong>BlinkIt_Clone Team</strong></p>
                <p style="font-size: 10px; color: #999;">© 2025 BlinkIt_Clone. All rights reserved.</p>
            </div>
        </div>
    `;
};

export default forgotPasswordEmailTemplate;
