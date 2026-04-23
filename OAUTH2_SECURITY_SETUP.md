# Smart Campus - OAuth 2.0 & Role-Based Access Control Setup

## 📋 Admin Credentials
- **Email**: admin@example.com
- **Password**: Admin123
- **Role**: ADMIN

## 🔐 OAuth 2.0 Google Sign-In Configuration

### Google OAuth 2.0 Credentials (Already Configured)
- **Client ID**: 71813655033-f7ecaeickeklunjpujusunn621b8dv4e.apps.googleusercontent.com
- **Client Secret**: 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
- **Redirect URI**: http://localhost:8080/login/oauth2/code/google

### How to Set Up Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 Client ID for Web application
3. Add authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3001/dashboard`
4. Copy the Client ID and Secret to `application.properties`

## 👥 User Roles

The system supports 4 roles:
1. **ADMIN** - Full system access, manage users, view analytics
2. **TECHNICIAN** - Admin-like privileges, can manage users
3. **LECTURER** - Can view student data, manage courses
4. **STUDENT** - Regular user access, view own data

## 🔒 Backend Role-Based Access Control

### Protected Admin Endpoints
All endpoints under `/api/admin/**` require `ADMIN` or `TECHNICIAN` role:

```
GET    /api/admin/users                 - Get all users
GET    /api/admin/users/{email}         - Get specific user
PUT    /api/admin/users/{email}/role    - Update user role
DELETE /api/admin/users/{email}         - Delete user
GET    /api/admin/stats                 - Get admin statistics
```

### Public Endpoints
```
GET    /                                - API info
POST   /api/auth/login                  - Email/password login
POST   /api/auth/register               - User registration
GET    /oauth2/authorization/google     - Google OAuth login redirect
```

## 🚀 Frontend Route Protection

All protected routes use the `ProtectedRoute` component:

```javascript
<Route 
  path="/dashboard" 
  element={<ProtectedRoute 
    element={<Dashboard />} 
    requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} 
  />} 
/>
```

## 🧪 Testing OAuth 2.0 Login

1. Start the application:
   ```
   Frontend: npm start (port 3000 or 3001)
   Backend: .\mvnw.cmd spring-boot:run (port 8080)
   ```

2. Click "Continue with Google" on login page
3. Authenticate with your Google account
4. User is automatically logged in and redirected to dashboard

## 📝 Test User Accounts

### Admin User
- Email: admin@example.com
- Password: Admin123

### Regular User (if needed)
- Email: john@example.com
- Password: Password123
- Can be promoted to ADMIN using: `PUT /api/auth/user/john@example.com/role` with `{"role":"ADMIN"}`

## 🔄 Changing User Roles

Use the admin panel or API:
```bash
# Change user role to ADMIN
$body = @{role="ADMIN"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/user/email@example.com/role" `
  -Method PUT -ContentType "application/json" -Body $body
```

## ✅ Security Features Implemented

- ✅ OAuth 2.0 Google Sign-In
- ✅ Role-Based Access Control (RBAC)
- ✅ Method-level security with @PreAuthorize annotations
- ✅ Protected frontend routes with ProtectedRoute component
- ✅ CORS configuration for secure cross-origin requests
- ✅ BCrypt password hashing for local authentication
- ✅ User role validation on endpoints
- ✅ Admin-only endpoints for user management

## 🐛 Troubleshooting

### OAuth Login Not Working
- Verify Google OAuth credentials in `application.properties`
- Check that `http://localhost:8080/login/oauth2/code/google` is in Google Cloud Console

### Cannot Access Admin Panel
- Ensure user has ADMIN or TECHNICIAN role
- Check role assignment in MongoDB or use update endpoint

### CORS Errors
- Both `localhost:3000` and `localhost:3001` are allowed
- Update `SecurityConfig` if using different ports

## 📚 API Documentation

### Login (Email/Password)
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123"
}

Response:
{
  "message": "Login successful",
  "status": "success",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  "token": "..."
}
```

### Google OAuth Login
```
GET /oauth2/authorization/google
Redirects to Google sign-in page, then redirects back to /dashboard after successful authentication
```

### Update User Role (Admin Only)
```
PUT /api/auth/user/{email}/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "ADMIN"
}
```

---

**Last Updated**: April 19, 2026
**Status**: ✅ Fully Configured and Tested
