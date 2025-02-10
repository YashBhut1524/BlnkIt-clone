const verificationEmailTemplate = ({ name, url }) => {
    return `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 15px; border-radius: 12px; background: #F8CB46; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); color: #000000;">
            <!-- Header Section -->
            <div style="text-align: center; padding: 10px;">
                <h1 style="color: #000000; font-size: 24px; margin: 0;">Welcome to BlinkIt_Clone!</h1>
                <p style="font-size: 14px; color: #000000;">Your trusted delivery partner.</p>
                <img 
                    src="https://res.cloudinary.com/do6byjyaw/image/upload/v1739107999/binkeyit/tjhuuywljma5t1oidnzw.png" 
                    alt="Delivery Guy on Scooter" 
                    style="width: 100%; max-width: 280px; border-radius: 10px; margin: 10px 0;"
                >
            </div>
            
            <!-- Content Section -->
            <div style="margin: 15px 0; text-align: center;">
                <p style="font-size: 14px; color: #000000;">Dear <strong>${name}</strong>,</p>
                <p style="font-size: 14px; color: #000000; line-height: 1.4; margin-bottom: 15px;">
                    Thank you for joining <strong>BlinkIt_Clone</strong>. Verify your email to get started!
                </p>
                <!-- Button Section -->
                <a 
                    href="${url}" 
                    style="text-decoration: none; display: inline-block; background: #6CCB5F; color: #fff; 
                    padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 8px; 
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);"
                >
                    Verify Email
                </a>
            </div>
            
            <!-- Footer Section -->
            <div style="border-top: 1px solid #2e2d2d; margin-top: 20px; padding-top: 10px; text-align: center; font-size: 12px; color: #000000;">
                <p>If you did not create this account, please ignore this email.</p>
                <p>Best regards, <br><strong>BlinkIt_Clone Team</strong></p>
                <p style="font-size: 10px; color: #000000;">© 2025 BlinkIt_Clone. All rights reserved.</p>
            </div>
        </div>
    `;
};

export default verificationEmailTemplate;
