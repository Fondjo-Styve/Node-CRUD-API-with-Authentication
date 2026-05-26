# Node CRUD API with Authentication

A full-featured, production-ready REST API built with Node.js and Express that implements comprehensive user authentication, blog management, and role-based access control with advanced security features.

## 🌟 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token generation and verification with 1-hour expiration
- **Email Verification**: 6-digit verification codes with 5-minute expiration sent via email
- **Password Reset Flow**: Secure forgot password mechanism with temporary reset tokens
- **Password Change**: Authenticated password changes with old password verification
- **Role-Based Access Control (RBAC)**: User and Admin roles with granular permissions
- **Cookie-based Token Storage**: HttpOnly cookies for enhanced security

### 📧 Email Service
- **Nodemailer Integration**: Gmail SMTP configuration for sending verification and reset codes
- **HTML Email Templates**: Professional email formatting
- **Configurable via Environment Variables**: Easy setup without code changes

### 🚦 Rate Limiting
- **Auth Limiter**: 5 requests per 15 minutes on authentication endpoints
- **Read Limiter**: 100 requests per 15 minutes on blog read operations
- **CRUD Limiter**: 10 requests per 15 minutes on create/update/delete operations
- **Brute-force Protection**: Prevents automated attacks on sensitive endpoints

### 📄 Pagination & Search
- **Pagination System**: 10 items per page by default with customizable page parameter
- **Full-Text Search**: Case-insensitive search across title, description, and body fields
- **Smart Filtering**: Combine pagination with search queries
- **Metadata Response**: Includes total count, current page, and limit in responses

### 🏗️ Blog/Post Management
- **Create Blogs**: Authenticated users can create blog posts with title, description, and body
- **Read Operations**: View personal blogs or all public blogs with search and pagination
- **Update Blogs**: Users can update their own blogs; admins can update any blog
- **Delete Blogs**: Users can delete their own blogs; admins have full deletion rights
- **Author Tracking**: Automatic author assignment and verification

### 🛡️ Security Features
- **Password Hashing**: bcrypt with 12-round salting
- **Verification Code Hashing**: Codes hashed before database storage
- **Input Validation**: Joi schema validation on all endpoints
- **Global Error Handling**: Centralized error middleware with consistent response format
- **Environment Variables**: Sensitive data protection via .env configuration
- **Database Indexing**: Optimized queries for better performance

### 👥 Admin Features
- **User Management**: Delete individual or multiple users
- **Blog Management**: Delete all blogs in database
- **Role Enforcement**: Admin-only endpoints with proper authorization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Gmail account (for email verification)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Fondjo-Styve/Node-CRUD-API-with-Authentication.git
cd Node-CRUD-API-with-Authentication
```

### 2. Create Environment Configuration File

Create a file named `.env` in the root directory of your project:

```bash
touch .env
```

### 3. Configure Your Environment Variables

Copy and paste the following configuration into your `.env` file:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Security
TOKEN_SECRET=your_jwt_secret_key_here

# Email Service Configuration (Nodemailer)
NODE_EMAIL_USER=your_email@gmail.com
NODE_EMAIL_SENDER_PASSWORD=your_app_password_here
```

### 4. Replace Placeholder Values

Update the following placeholders with your actual values:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | The port number your local server will run on | `5000`, `3500`, `8080` |
| `MONGODB_URI` | Your MongoDB connection string (local or MongoDB Atlas) | `mongodb+srv://username:password@cluster.mongodb.net/dbname` |
| `TOKEN_SECRET` | A secure, random string used to sign authentication tokens | `your-super-secret-random-key-here` |
| `NODE_EMAIL_USER` | The email address used to send automated emails | `your_email@gmail.com` |
| `NODE_EMAIL_SENDER_PASSWORD` | App Password from your email provider (NOT your actual password) | Generated from Gmail App Passwords |

### 5. Install Dependencies

```bash
npm install
```

### 6. Start the Development Server

```bash
npm start
```

Your server will now be running at `http://localhost:PORT` (default: http://localhost:5000)

You should see the output:
```
server started on http://localhost:5000
database connected
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signUp
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "You've successfully signed up John Doe",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "verified": false,
    "createdAt": "2026-05-26T14:17:03Z"
  }
}
```

#### Send Verification Code
```http
POST /auth/sendVerificationCode
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent successfully. It expires in 5 minutes"
}
```

#### Verify Email
```http
POST /auth/verifyVerificationCode
Content-Type: application/json

{
  "email": "john@example.com",
  "verificationCode": "123456"
}
```

#### Sign In
```http
POST /auth/signIn
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Change Password
```http
POST /auth/changePassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

#### Forgot Password
```http
POST /auth/forgotPassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Verify Forgot Password Code
```http
POST /auth/verifyForgotPasswordCode
Content-Type: application/json

{
  "email": "john@example.com",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification successful",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Reset Password
```http
POST /auth/resetPassword
Content-Type: application/json

{
  "newPassword": "NewSecurePass456",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Sign Out
```http
POST /auth/signOut
Authorization: Bearer <token>
```

---

### Blog Endpoints

#### Create Blog
```http
POST /posts/createBlog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog",
  "description": "A short description of my blog",
  "body": "This is the main content of my blog post with detailed information..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog created",
  "data": {
    "_id": "blog_id",
    "title": "My First Blog",
    "description": "A short description of my blog",
    "body": "This is the main content...",
    "author": "user_id",
    "createdAt": "2026-05-26T14:17:03Z",
    "updatedAt": "2026-05-26T14:17:03Z"
  }
}
```

#### Get User's Blogs
```http
GET /posts/getUsersBlog?page=1&search=keyword
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "blog_id",
      "title": "My First Blog",
      "author": "user_id",
      "createdAt": "2026-05-26T14:17:03Z"
    }
  ],
  "pagination": {
    "page": 1,
    "totalBlog": 5,
    "limit": 10
  }
}
```

#### Get All Blogs (Public)
```http
GET /posts/getAllBlogs?page=1&search=keyword
```

#### Update Blog
```http
POST /posts/updateBlog/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "body": "Updated body content"
}
```

#### Delete Blog
```http
DELETE /posts/deleteBlog/:id
Authorization: Bearer <token>
```

#### Delete All Blogs (Admin Only)
```http
DELETE /posts/deleteAllBlogs
Authorization: Bearer <admin_token>
```

---

### Admin Endpoints

#### Delete Single User
```http
DELETE /auth/deleteUser/:id
Authorization: Bearer <admin_token>
```

#### Delete All Users (Regular users only)
```http
DELETE /auth/deleteAllUsers
Authorization: Bearer <admin_token>
```

---

## 🔒 Security Best Practices

- **Passwords**: Minimum 8 characters, maximum 16 characters, hashed with bcrypt
- **Tokens**: JWT with 1-hour expiration for session tokens and 5 minutes for reset tokens
- **Verification Codes**: 6-digit codes expiring in 5 minutes, hashed before storage
- **Rate Limiting**: Different limits for auth (5/15min), read (100/15min), and write (10/15min) operations
- **Input Validation**: All inputs validated with Joi schemas
- **Error Handling**: Sensitive information never exposed in error messages

## 📁 Project Structure

```
.
├── controllers/           # Business logic for routes
│   ├── authController.js  # Authentication operations
│   ├── blogController.js  # Blog CRUD operations
│   └── adminController.js # Admin operations
├── middleware/            # Express middleware
│   ├── authorize.js       # Role-based authorization
│   ├── errorHandler.js    # Global error handling
│   ├── identifier.js      # JWT verification
│   ├── pagination.js      # Pagination logic
│   └── rateLimiter.js     # Rate limiting
├── models/                # Mongoose schemas
│   ├── userModel.js       # User schema
│   └── blogModel.js       # Blog schema
├── routers/               # API route definitions
│   ├── userAuthRouters.js # Auth routes
│   └── postsRoutes.js     # Blog routes
├── validators/            # Joi validation schemas
│   ├── authValidator.js   # Auth validations
│   └── blogValidator.js   # Blog validations
├── utils/                 # Helper functions
│   └── hashing.js         # Password/code hashing
├── configs.js/            # Configuration files
│   ├── dbConnect.js       # MongoDB connection
│   └── sendMail.js        # Email service
├── server.js              # Express app setup
├── package.json           # Dependencies
└── .env                   # Environment variables (not committed)
```

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js 5.2.1
- **Database**: MongoDB, Mongoose 9.3.0
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, express-rate-limit, helmet
- **Validation**: Joi
- **Email**: Nodemailer
- **Development**: nodemon
- **File Upload**: Multer (ready for use)

## 📊 Database Models

### User Model
- Email (unique, required)
- Name (required)
- Password (hashed, not selected by default)
- Role (user | admin)
- Verified status
- Email verification code & expiration
- Password reset code & expiration
- Timestamps (createdAt, updatedAt)

### Blog Model
- Title (3-120 characters, required)
- Description (optional, 10+ characters)
- Body (10+ characters, required)
- Author (reference to User)
- Timestamps (createdAt, updatedAt)

## 🧪 Example Usage

### Complete Authentication Flow

```bash
# 1. Sign up
curl -X POST http://localhost:5000/api/auth/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# 2. Send verification code
curl -X POST http://localhost:5000/api/auth/sendVerificationCode \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'

# 3. Verify email (check your inbox for code)
curl -X POST http://localhost:5000/api/auth/verifyVerificationCode \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "verificationCode": "123456"
  }'

# 4. Sign in
curl -X POST http://localhost:5000/api/auth/signIn \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# 5. Create a blog
curl -X POST http://localhost:5000/api/posts/createBlog \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "description": "A short description",
    "body": "This is the main content of my blog..."
  }'
```

## 🐛 Known Issues & Improvements

- [ ] Add helmet middleware to server setup
- [ ] Implement request logging
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit and integration tests
- [ ] Implement refresh token mechanism
- [ ] Add two-factor authentication (2FA)
- [ ] Add file upload capability with Multer
- [ ] Add API versioning
- [ ] Fix error handler bug in authController.js line 27
- [ ] Fix countDocuments typo in adminController.js line 58

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🔗 Related Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Joi Validation Documentation](https://joi.dev/)
- [Nodemailer Documentation](https://nodemailer.com/)

## 👨‍💻 Author

**Fondjo-Styve**
- GitHub: [@Fondjo-Styve](https://github.com/Fondjo-Styve)

---

**Made with ❤️ | Last Updated: May 26, 2026**
