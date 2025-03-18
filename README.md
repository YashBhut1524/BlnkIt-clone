# BlinkIt Clone

## Live Link
https://blnkit-clone.vercel.app/

## Overview
This is a BlinkIt clone built using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack. It is an online grocery ordering and delivery application that allows users to browse products, add them to the cart, and complete purchases using integrated payment gateways.

## Admin Credentials

Use the following credentials to log in as an admin:

- **Email:** `admin123@gmail.com`
- **Password:** `Admin@123`

## Features
- **User Authentication** (Sign up, Login, Logout, JWT Authentication)
- **Product Listing and Search**
- **Category and SubCategory** (add, remove, update)
- **Cart Management** (Add, Remove, Update Items)
- **Order Processing** (Checkout, Payment Integration with Stripe & Razorpay)
- **Google Maps Integration** (Address Selection, Geolocation)
- **Cloudinary Integration** (Image Uploads)
- **Email Notifications** (Resend API)
- **Secure API** with Helmet, CORS, and Cookie Parser

## Tech Stack
### Frontend
- **React.js** (with Vite for fast builds)
- **Redux Toolkit** (State Management)
- **Tailwind CSS & MUI** (UI Styling)
- **React Router** (Navigation)
- **Framer Motion** (Animations)
- **Axios** (API Handling)

### Backend
- **Node.js & Express.js**
- **MongoDB with Mongoose** (Database)
- **Cloudinary** (Media Storage)
- **Resend API** (Email Services)
- **Stripe & Razorpay** (Payment Gateways)
- **Multer & Sharp** (Image Upload & Processing)

## Installation
### Prerequisites
- **Node.js** (Latest LTS version)
- **MongoDB** (Locally or using a cloud service like MongoDB Atlas)
- **Cloudinary Account** (For image storage)
- **Stripe & Razorpay Accounts** (For payment integration)

### Clone the Repository
```sh
git clone https://github.com/YashBhut1524/BlnkIt-clone
cd blinkit-clone
```

### Setup Server
```sh
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following variables:
```
CLIENT_URL = "http://localhost:5173"
MONGODB_URI = "your-mongodb-uri"
RESEND_API_KEY = "your-resend-api-key"
SECRET_KEY_ACCESS_TOKEN = "your-access-token-secret"
SECRET_KEY_REFRESH_TOKEN = "your-refresh-token-secret"
CLOUDINARY_CLOUD_NAME = "your-cloudinary-name"
CLOUDINARY_API_KEY = "your-cloudinary-api-key"
CLOUDINARY_API_SECRET = "your-cloudinary-api-secret"
STRIPE_SECRET_KEY = "your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET_KEY = "your-stripe-webhook-secret"
RAZORPAY_SECRET_KEY = "your-razorpay-secret-key"
RAZORPAY_ID_KEY = "your-razorpay-id-key"
PORT = 8080
```
Run the server:
```sh
npm run dev
```

### Setup Client
```sh
cd ../client
npm install
```
Create a `.env` file in the `client` directory and add the following variables:
```
VITE_API_URL = "http://localhost:8080"
VITE_GOOGLE_API_KEY = "your-google-api-key"
VITE_STRIPE_PUBLISHABLE_KEY = "your-stripe-publishable-key"
VITE_RAZORPAY_ID_KEY = "your-razorpay-id-key"
```
Run the client:
```sh
npm run dev
```

## Usage
1. Open the client at `http://localhost:5173`
2. Sign up or log in
3. Browse products, add to cart, and place orders
4. Checkout using Stripe or Razorpay

## Folder Structure
```
blinkit-clone/
  ├── client/         # Frontend (React.js)
  │   ├── src/
  │   ├── public/
  │   ├── .env
  │   └── package.json
  ├── server/         # Backend (Node.js + Express.js)
  │   ├── controllers/
  │   ├── models/
  │   ├── routes/
  │   ├── middleware/
  │   ├── config/
  │   ├── .env
  │   └── package.json
  ├── README.md       # Project Documentation
```

# BlinkIt Clone API Documentation

## **User Controller**
1. **Register User**  
   - **Method:** `POST`  
   - **Path:** `/api/user/register`  
   - **Request Body:**  
     ```json
     {
       "name": "example name",
       "email": "example@gmail.com",
       "password": "123456",
       "mobile": "1234567890"
     }
     ```

2. **Login**  
   - **Method:** `POST`  
   - **Path:** `/api/user/login`  
   - **Body:** 
   ```json
     {
        "email": "example@gmail.com",
        "password": "123456"
    }
     ```

3. **Refresh Token**  
   - **Method:** `POST`  
   - **Path:** `/api/user/refresh-token`  
   - **Headers:**  
     ```json
     {
       "Cookie": 
       {
        "refreshToken=your-refresh-token", 
        "accessToken= your-access-token"
       }
     }
     ```
   - **OR**  
   - **Authorization:**  
     ```json
     {
       "Authorization": "Bearer your-refresh-token"
     }
     ```
   - **Request Body:** `None`

4. **Upload Avatar**  
   - **Method:** `PUT`  
   - **Path:** `/api/user/upload-avatar`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Headers:**  
     ```
     {
       "Content-Type": "multipart/form-data"
     }
     ```
   - **Body (form-data):**  

     Key   | Type  | Value  
     ------|-------|--------  
     avatar | File  | (Select an image file)  
     path   | Text  | "profile"  

   - **Description:** This API uploads a user avatar. The `avatar` field should contain an image file, and the `path` field specifies where the avatar is being stored (e.g., "profile").

5. **Forgot Password (Send OTP)**  
   - **Method:** `PUT`  
   - **Path:** `/api/user/forgot-password`  
   - **Body:** 
        ```json 
            {
                "email": "example@gmail.com"
            }
        ```

6. **Verify Forgot Password OTP**  
   - **Method:** `PUT`  
   - **Path:** `/api/user/verify-forgot-password-otp`  
   - **Body:**
        ```json
        {
            "email": "example@gmail.com",
            "otp": "665233" //example otp
        }
        ```

7. **Reset Password**  
   - **Method:** `PUT`  
   - **Path:** `/api/user/reset-password`  
   - **Body:**
        ```json
        {
            "email": "example@gmail.com",
            "newPassword": "newpass1234",
            "confirmPassword": "newpass1234"
        }
        ```

8. **Logout**  
   - **Method:** `GET`  
   - **Path:** `/api/user/logout`
   - **Header** `accessToken: your_access_token ` //user must be logged_in 
   - **Body:** *None*
   - **Description:** This API logs out the user by invalidating the session or token.

9. **Get User Details**  
   - **Method:** `GET`  
   - **Path:** `/api/user/get-user-details`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** None  
   - **Description:** This API retrieves the details of the authenticated user.  

10. **Update User**  
   - **Method:** `PUT`  
   - **Path:** `/api/user/update-user`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:**  
     ```json
     {
         "name": "RandomUser123",
         "email": "randomuser@example.com",
         "avatar": "http://res.cloudinary.com/demo/image/upload/v1740893674/binkeyit/profile/randomavatar.jpg",
         "mobile": 9876543210,
         "verify_email": true,
         "status": "Active",
         "role": ["ADMIN"],
     }
     ```  
---

## **Image Controller**
1. **Upload Image**  
   - **Method:** `POST`  
   - **Path:** `/api/file/upload-image`  
   - **Headers:**  
     ```json
     {
         "Content-Type": "multipart/form-data",
         "accessToken": "your_access_token"
     }
     ```
   - **Body:**  
     The request should be sent as `multipart/form-data` with the following fields:
     - `file`: The image file to be uploaded.
     - `path`: (String) The folder path where the image will be stored inside Cloudinary. (example "/category")

2. **Delete Image**  
   - **Method:** `POST`  
   - **Path:** `/api/file/delete-image`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "image": "https://res.cloudinary.com/do6byjyaw/image/upload/v1740323816/binkeyit/example.png"
        }
        ```

---

## **Category Controller**
1. **Add Category** (Admin)
   - **Method:** `POST`  
   - **Path:** `/api/category/add-category` 
   - **Header** `accessToken: your_access_token ` //user must be logged_in 
   - **Body:** 
        ```json
            {
                "name": "Category Name",
                "image": "http://res.cloudinary.com/demo/image/upload/sample-category.png"
            }

        ```

2. **Get Category**  
   - **Method:** `GET`  
   - **Path:** `/api/category/get-category`  
   - **Headers:** *(if any, specify here, otherwise omit)*  
   - **Body:** None  
   - **Description:** This API retrieves the details of the all Categories. 

3. **Delete Category** (Admin)
   - **Method:** `PUT`  
   - **Path:** `/api/category/delete-category`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "categoryId": "example_categoryId"
        }
        ```

4. **Update Category** (Admin)  
   - **Method:** `PUT`  
   - **Path:** `/api/category/update-category`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "categoryId": "example_categoryId",
            "name": "category name",
            "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740324165/binkeyit/category/example.png"
        }
        ```

---

## **Subcategory Controller**
1. **Add Subcategory** (Admin)  
   - **Method:** `POST`  
   - **Path:** `/api/sub-category/add-sub-category` 
   - **Header** `accessToken: your_access_token ` //user must be logged_in 
   - **Body:** 
        ```json
        {
            "name": "SubCategoryName",
            "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740498662/binkeyit/subCategory/example.webp",
            "category": [
                {
                    "_id": "67bf1820ff3da977500b0253",
                    "name": "category_name",
                    "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740404199/binkeyit/example.png",
                    "createdAt": "2025-02-24T13:36:38.274Z",
                    "updatedAt": "2025-02-24T13:36:38.274Z",
                    "__v": 0
                },
            ]
        }
        ```

2. **Get Subcategory**  
   - **Method:** `GET`  
   - **Path:** `/api/sub-category/get-sub-category`  
   - **Body:** `None`

3. **Update Subcategory** (Admin)  
   - **Method:** `PUT`  
   - **Path:** `/api/sub-category/update-sub-category` 
   - **Header** `accessToken: your_access_token ` //user must be logged_in 
   - **Body:** 
        ```json
        {
            "subCategoryId": "67bf1820ff3da977500b0253",
            "name": "example_subCategory_name",
            "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740572634/binkeyit/subCategory/example.webp",
            "category": [
                {
                    "_id": "67ad1820hf3d3467500b053",
                    "name": "example_Category_name",
                    "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740331473/binkeyit/example.png",
                    "createdAt": "2025-02-23T17:24:33.075Z",
                    "updatedAt": "2025-02-23T17:24:33.075Z",
                    "__v": 0
                },
            ]
        }
        ```

4. **Delete Subcategory** (Admin)  
   - **Method:** `PUT`  
   - **Path:** `/api/sub-category/delete-sub-category`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "subCategoryId": "67bf1820ff3da977500b0253"
        }
        ```

---

## **Product Controller**
1. **Add Product** (Admin)  
   - **Method:** `POST`  
   - **Path:** `/api/product/add-product`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "name": "product_name",
            "image": [
                "http://res.cloudinary.com/do6byjyaw/image/upload/v1740747507/binkeyit/product/example-image1.jpg",
                "http://res.cloudinary.com/do6byjyaw/image/upload/v1740747508/binkeyit/product/example-image2.jpg",
            ],
            "category": ["67bf43c549c650fe3ea9b14f"],
            "subCategory": ["67bf475014f73fb3255fa957"],
            "unit": "5kg",
            "stock": 500,
            "price": 999,
            "description": "Product_Description",
            "discount": 10,
            "more_details": {
                "field_name": "value",
            },
            "publish": true
        }

        ```

2. **Get Product**  
   - **Method:** `POST`  
   - **Path:** `/api/product/get-product`  
   - **Body:** 
        ```json
        {
            "page": 1,
            "limit": 10,
            "search": ""
        }

        ```

3. **Search Product**  
   - **Method:** `POST`  
   - **Path:** `/api/product/search-product`  
   - **Body:** 
        ```json
        {
            "search": "Search_Query" //maggie, atta etc
        }
        ```

4. **Get Product By ID**  
   - **Method:** GET  
   - **Path:** `/api/product/get-product-by-id`  
   - **Body:** 
        ```json
        {
            "id": "product_id" //product._id
        }
        ```

5. **Get Product By Category**  
   - **Method:** `POST`  
   - **Path:** `/api/product/get-products-by-category`  
   - **Body:** 
        ```json
        {
            "id": "category_id" //category._id
        }
        ```

6. **Get Product By Category and Subcategory**  
   - **Method:** `POST`  
   - **Path:** `/api/product/get-products-by-category-and-sub-category`  
   - **Body:** 
        ```json
        {
            "categoryId": "category_id", //category._id
            "subCategoryId": "subcategory_id", //subcategory._id
        }
        ```

7. **Update Product** (Admin)  
   - **Method:** `PUT`  
   - **Path:** `/api/product/update-product`  \
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "name": "product_name",
            "image": [
                "http://res.cloudinary.com/do6byjyaw/image/upload/v1740826869/binkeyit/product/example-image1.jpg",
                "http://res.cloudinary.com/do6byjyaw/image/upload/v1740826870/binkeyit/product/example-image1.jpg",

            ],
            "category": [
                {
                    "_id": "category_id",
                    "name": "category_name",
                    "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740588247/binkeyit/category/example.png",
                    "createdAt": "2025-02-26T16:44:08.068Z",
                    "updatedAt": "2025-02-26T16:44:08.068Z",
                    "__v": 0
                }
            ],
            "subCategory": [
                {
                    "_id": "subCategory1_id",
                    "name": "subCategory1_name",
                    "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740589773/binkeyit/subCategory/mrkd4umyckciaqse5d8z.webp",
                    "category": [
                        "Category_id"
                    ],
                    "createdAt": "2025-02-26T17:09:34.974Z",
                    "updatedAt": "2025-02-26T17:09:34.974Z",
                    "__v": 0
                },
                {
                    "_id": "subCategory2_id",
                    "name": "subCategory2_name",
                    "image": "http://res.cloudinary.com/do6byjyaw/image/upload/v1740589781/binkeyit/subCategory/fpt1jowdpmwhbhhgmwb9.webp",
                    "category": [
                        "Category_id"
                    ],
                    "createdAt": "2025-02-26T17:09:44.291Z",
                    "updatedAt": "2025-02-26T17:09:44.291Z",
                    "__v": 0
                }
            ],
            "unit": "48g", //unit of product 
            "stock": 12, //number of stock 
            "price": 30, //product Price
            "description": "Product_Description",
            "discount": "",
            "more_details": {
                "field_name": "value"
            },
            "publish": true
        }

        ```

8. **Delete Product** (Admin)  
   - **Method:** `DELETE`  
   - **Path:** `/api/product/delete-product/${product_id}` 
   - **Header** `accessToken: your_access_token ` //user must be logged_in 
   - **Body:** `None`

---

## **Cart Controller**
1. **Create Cart**  
   - **Method:** `POST`  
   - **Path:** `/api/cart/create-cart`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "productId": "product_id"
        }
        ```

2. **Get Cart Items**  
   - **Method:** `GET`  
   - **Path:** `/api/cart/get-cart-items` 
   - **Header** `accessToken: your_access_token ` //user must be logged_in 
   - **Body:** `None`

3. **Update Cart Item Quantity**  
   - **Method:** `PUT`  
   - **Path:** `/api/cart/update-cart-item-quantity`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "_id": "product_id",
            "quantity": 4 //quantity that you want to set
        }
        ```

4. **Delete Cart Item**  
   - **Method:** `DELETE`  
   - **Path:** `/api/cart/delete-cart-item`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "_id": "product_id"
        }
        ```

---

## **Address Controller**
1. **Add New Address**  
   - **Method:** `POST`  
   - **Path:** `/api/address/add-new-address`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "saveAs": "home", //saveAs type
            "flatHouseNumber": "flatHouseNumber",
            "floor": "", //optional
            "street": "street_name",
            "area": "area_name",
            "landmark": "", //optional
            "city": "city_name",
            "state": "state_name",
            "pincode": "pincode",
            "country": "country_name",
            "name": "user_name",
            "mobileNumber": "user_mobile",
            "latitude": 22.2939253,
            "longitude": 70.77699059999999,
            "defaultAddress": true,
            "userId": "user_id"
        }
        ```

2. **Get Address**  
   - **Method:** `GET`  
   - **Path:** `/api/address/get-address`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** `None`

3. **Update Address**  
   - **Method:** `PUT`  
   - **Path:** `/api/address/update-address`  \
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "_id": "address_id",
            "saveAs": "home", //saveAs type
            "flatHouseNumber": "flatHouseNumber",
            "floor": "", //optional
            "street": "street_name",
            "area": "area_name",
            "landmark": "", //optional
            "city": "city_name",
            "state": "state_name",
            "pincode": "pincode",
            "country": "country_name",
            "name": "user_name",
            "mobileNumber": "user_mobile",
            "latitude": 22.2939253,
            "longitude": 70.77699059999999,
            "defaultAddress": true,
            "userId": "user_id"
        }   
        ```

4. **Delete Address**  
   - **Method:** `DELETE`  
   - **Path:** `/api/address/delete-address`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "_id": "address_id"
        }
        ```

5. **Set Default Address**  
   - **Method:** `PUT`  
   - **Path:** `/api/address/set-default-address`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** 
        ```json
        {
            "_id": "address_id"
        }
        ```

---

## **Order Controller**
1. **Add Cash on Delivery Order**  
   - **Method:** `POST`  
   - **Path:** `/api/order/add-cash-on-delivery-order`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "itemList": [
                {
                    "_id": "67cd8878945e2e95f7d01fb8",
                    "productId": {
                        "_id": "67c1db4048d66d1b69953edd",
                        "name": "product_name",
                        "image": [
                            "http://res.cloudinary.com/do6byjyaw/image/upload/v1740757642/binkeyit/product/swx3nl2mv2ptksjropjw.jpg",
                            "http://res.cloudinary.com/do6byjyaw/image/upload/v1740757643/binkeyit/product/diq3fxysitvbyyh5gk3a.jpg",
                        ],
                        "category": [
                            "category_id"
                        ],
                        "subCategory": [
                            "subcategory_id"
                        ],
                        "unit": "500g",
                        "stock": 50,
                        "price": 499,
                        "discount": 15,
                        "description": "product_description",
                        "more_details": {
                           "field_name": "value"
                        },
                        "publish": true,
                        "createdAt": "2025-02-28T15:50:24.221Z",
                        "updatedAt": "2025-02-28T15:50:24.221Z",
                        "__v": 0
                    },
                    "quantity": 1,
                    "userId": "user_id",
                    "createdAt": "2025-03-09T12:24:24.163Z",
                    "updatedAt": "2025-03-09T12:24:24.163Z",
                    "__v": 0
                }
            ],
            "totalAmt": 479.15,
            "subTotalAmt": 499,
            "delivery_address_id": "address_id",
            "otherCharge": 43
        }
        ```

2. **Add Razorpay Payment Order**  
   - **Method:** `POST`  
   - **Path:** `/api/order/add-razor-payment-checkout`
   - **Header** `accessToken: your_access_token ` //user must be logged_in  
   - **Body:** 
        ```json
        {
            "itemList": [
                {
                    "_id": "67cd8878945e2e95f7d01fb8",
                    "productId": {
                        "_id": "67c1db4048d66d1b69953edd",
                        "name": "product_name",
                        "image": [
                            "http://res.cloudinary.com/do6byjyaw/image/upload/v1740757642/binkeyit/product/swx3nl2mv2ptksjropjw.jpg",
                            "http://res.cloudinary.com/do6byjyaw/image/upload/v1740757643/binkeyit/product/diq3fxysitvbyyh5gk3a.jpg",
                        ],
                        "category": [
                            "category_id"
                        ],
                        "subCategory": [
                            "subcategory_id"
                        ],
                        "unit": "500g",
                        "stock": 50,
                        "price": 499,
                        "discount": 15,
                        "description": "product_description",
                        "more_details": {
                           "field_name": "value"
                        },
                        "publish": true,
                        "createdAt": "2025-02-28T15:50:24.221Z",
                        "updatedAt": "2025-02-28T15:50:24.221Z",
                        "__v": 0
                    },
                    "quantity": 1,
                    "userId": "user_id",
                    "createdAt": "2025-03-09T12:24:24.163Z",
                    "updatedAt": "2025-03-09T12:24:24.163Z",
                    "__v": 0
                }
            ],
            "totalAmt": 479.15,
            "subTotalAmt": 499,
            "delivery_address_id": "address_id",
            "otherCharge": 43
        }
        ```

3. **Razorpay Payment Verification**
   - **Method:** `POST`  
   - **Path:** `/api/order/razorpay-payment-verification`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body** `None`

4. **Add Stripe Payment Order**  
   - **Method:** `POST`  
   - **Path:** `/api/order/add-razor-payment-checkout`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in

   - **Body:** 
        ```json
        {
            "itemList": [
                {
                    "_id": "67cd8878945e2e95f7d01fb8",
                    "productId": {
                        "_id": "67c1db4048d66d1b69953edd",
                        "name": "product_name",
                        "image": [
                            "http://res.cloudinary.com/do6byjyaw/image/upload/v1740757642/binkeyit/product/swx3nl2mv2ptksjropjw.jpg",
                            "http://res.cloudinary.com/do6byjyaw/image/upload/v1740757643/binkeyit/product/diq3fxysitvbyyh5gk3a.jpg",
                        ],
                        "category": [
                            "category_id"
                        ],
                        "subCategory": [
                            "subcategory_id"
                        ],
                        "unit": "500g",
                        "stock": 50,
                        "price": 499,
                        "discount": 15,
                        "description": "product_description",
                        "more_details": {
                           "field_name": "value"
                        },
                        "publish": true,
                        "createdAt": "2025-02-28T15:50:24.221Z",
                        "updatedAt": "2025-02-28T15:50:24.221Z",
                        "__v": 0
                    },
                    "quantity": 1,
                    "userId": "user_id",
                    "createdAt": "2025-03-09T12:24:24.163Z",
                    "updatedAt": "2025-03-09T12:24:24.163Z",
                    "__v": 0
                }
            ],
            "totalAmt": 479.15,
            "subTotalAmt": 499,
            "delivery_address_id": "address_id",
            "otherCharge": 43
        }
        ```
        

5. **Stripe webhook**
   - **Method:** `POST`  
   - **Path:** `/api/order/webhook`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** `None`

6. **Get Orders**  
   - **Method:** `GET`  
   - **Path:** `/api/order/get-orders`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** `None`


7. **Get All Orders For Admin** 
   - **Method:** `GET`  
   - **Path:** `/api/order/get-all-orders`  
   - **Header** `accessToken: your_access_token ` //user must be logged_in
   - **Body:** `None`



## Contributing
Pull requests are welcome. Please open an issue first to discuss major changes.

Contributions are always welcome!


