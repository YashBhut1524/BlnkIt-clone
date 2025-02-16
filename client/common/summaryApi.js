
export const baseURL = import.meta.env.VITE_API_URL

const summaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgotPassword : {
        url : '/api/user/forgot-password',
        method : 'put'
    },
    verifyForgotPasswordOTP : {
        url : '/api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url: "/api/user/reset-password",
        method: "put"
    },
    refreshToken : {
        url: "/api/user/refresh-token",
        method: "post"
    }
}

export default summaryApi