# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication Endpoints

### 1. Login
- **URL:** `/auth/login`
- **Method:** POST
- **Description:** Login with email and password
- **Request Body:**
```json
{
    "email": "example@email.com",
    "password": "yourpassword"
}
```

### 2. Register (Business Admin)
- **URL:** `/auth/register`
- **Method:** POST
- **Description:** Public registration for business admins
- **Request Body:**
```json
{
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "phone": "string",
    "business_name": "string",
    "business_type": "string"
}
```

## Staff Endpoints

### 1. Staff Login
- **URL:** `/auth/staff/login`
- **Method:** POST
- **Description:** Login endpoint for staff members
- **Request Body:**
```json
{
    "work_email": "string",
    "password": "string"
}
```

### 2. Get Staff Profile
- **URL:** `/auth/staff/profile`
- **Method:** GET
- **Description:** Get staff member profile details
- **Authentication:** Required (Staff Token)

## Protected Routes

### Admin Routes

#### 1. Create Admin (Super Admin only)
- **URL:** `/auth/admin/create`
- **Method:** POST
- **Description:** Super admin creates admin
- **Authentication:** Required (Super Admin Token)

#### 2. Create Staff (Admin only)
- **URL:** `/auth/staff/create`
- **Method:** POST
- **Description:** Admin creates staff
- **Authentication:** Required (Admin Token)

### Service Provider Routes

#### 1. Create Service Provider (Super Admin only)
- **URL:** `/auth/service-provider/create`
- **Method:** POST
- **Description:** Super admin creates service provider
- **Authentication:** Required (Super Admin Token)

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```
