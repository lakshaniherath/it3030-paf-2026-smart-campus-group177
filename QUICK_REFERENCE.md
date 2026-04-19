# Smart Campus - Quick Reference Guide

## 🎯 Quick Links
- **Admin Credentials**: admin@example.com / Admin123
- **Backend**: http://localhost:8080 (Spring Boot)
- **Frontend**: http://localhost:3001 (React)
- **Database**: MongoDB Atlas (paf/paf123)

---

## 👥 User Roles

| Role | Access Level | Features |
|------|-------------|----------|
| ADMIN | Full | User management, analytics, system settings |
| TECHNICIAN | Full | Same as ADMIN, system maintenance |
| LECTURER | Medium | Course management, student view |
| STUDENT | Basic | Course enrollment, tasks, profile |

---

## 🔐 Login Options

### Email/Password
```
POST /api/auth/login
{"email": "admin@example.com", "password": "Admin123"}
```

### Google OAuth
```
GET /oauth2/authorization/google
→ Redirects to Google sign-in
→ Auto-creates user on first sign-in
→ Defaults new users to STUDENT role
```

---

## 📍 Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/dashboard` - Intelligent router (auto-selects based on role)
- `/admin-dashboard` - Admin panel (ADMIN/TECHNICIAN only)
- `/user-dashboard` - Student panel (STUDENT/LECTURER)

---

## 🛠️ Admin API Endpoints

All require ADMIN or TECHNICIAN role and Authorization header:

```
GET    /api/admin/users              # List all users
GET    /api/admin/users/{email}      # Get specific user
PUT    /api/admin/users/{email}/role # Update user role {role: "ADMIN"}
DELETE /api/admin/users/{email}      # Delete user
GET    /api/admin/stats              # System statistics
```

---

## 📊 Frontend Architecture

```
App.js
├─ Public Routes
│  ├─ Home
│  ├─ Login
│  └─ Register
└─ Protected Routes (with ProtectedRoute wrapper)
   ├─ /dashboard → Dashboard (router)
   │  ├─ ADMIN/TECHNICIAN → AdminDashboard
   │  └─ STUDENT/LECTURER → UserDashboard
   ├─ /admin-dashboard → AdminDashboard (direct access)
   └─ /user-dashboard → UserDashboard (direct access)
```

---

## 🔒 Backend Security

```
SecurityConfig.java
├─ CORS: localhost:3000, localhost:3001
├─ OAuth2: Google login enabled
├─ PasswordEncoder: BCryptPasswordEncoder
├─ Method Security: @EnableMethodSecurity(prePostEnabled = true)
└─ Protected Endpoints: All except /login/**, /oauth2/**, /api/auth/**

AdminController.java
├─ All methods: @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
└─ Returns 403 Forbidden if unauthorized
```

---

## 💾 User Data Flow

```
1. Login Form
   ↓
2. POST /api/auth/login or /oauth2/authorization/google
   ↓
3. Backend validates & creates/updates user in MongoDB
   ↓
4. Returns {user: {id, name, email, role}, token}
   ↓
5. Frontend stores in localStorage
   ├─ localStorage['user'] = JSON.stringify({id, name, email, role})
   └─ localStorage['authToken'] = token
   ↓
6. Dashboard checks role & renders appropriate interface
```

---

## 🧪 Common Testing Scenarios

### Test Admin Access
```powershell
# Login as admin
Email: admin@example.com
Password: Admin123

# Visit /admin-dashboard or /api/admin/users
# Should work ✅
```

### Test Student Access
```powershell
# Login as student
Email: john@example.com
Password: Password123

# Visit /user-dashboard
# Should work ✅

# Visit /admin-dashboard
# Should redirect to /dashboard ✅

# Try /api/admin/users
# Should get 403 Forbidden ✅
```

### Test Google OAuth
```
1. Click "Continue with Google"
2. Sign in with your Google account
3. First-time users auto-created with STUDENT role
4. Redirected to dashboard
```

### Test Route Protection
```
1. Open /dashboard without logging in
2. Should redirect to /login ✅

3. Clear localStorage manually
4. Try to access /admin-dashboard
5. Should redirect to /login ✅
```

---

## 🔄 Update User Role

### Via API
```powershell
$body = @{role="LECTURER"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/user/email@example.com/role" `
  -Method PUT -ContentType "application/json" -Body $body
```

### Roles Can Be
- ADMIN
- TECHNICIAN
- LECTURER
- STUDENT

---

## 🗄️ Database Schema

### User Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hash),
  role: String (ADMIN|TECHNICIAN|LECTURER|STUDENT),
  provider: String (local|oauth_google),
  createdAt: Date
}
```

### MongoDB Connection
```
URI: mongodb+srv://paf:paf123@cluster0.0vfmwfr.mongodb.net/smart_campus_db?retryWrites=true&w=majority
Database: smart_campus_db
Collection: users
```

---

## 🚀 Startup Commands

### Terminal 1: Backend
```powershell
cd Backend
.\mvnw.cmd spring-boot:run
# Starts on http://localhost:8080
```

### Terminal 2: Frontend
```powershell
cd frontend
npm start
# Starts on http://localhost:3001
```

---

## ⚠️ Common Issues & Solutions

### "Cannot access admin dashboard as admin"
```
Solution: 
1. Verify user role: POST /api/auth/login and check role
2. If needed, update role: PUT /api/auth/user/{email}/role
3. Logout and login again to refresh localStorage
```

### "CORS error when calling backend"
```
Solution:
1. Verify SecurityConfig has your port in allowedOrigins
2. Check if frontend is running on 3000 or 3001
3. Add the correct port to SecurityConfig if needed
```

### "Google OAuth not working"
```
Solution:
1. Verify credentials in application.properties
2. Check Google Cloud Console for correct Client ID
3. Ensure http://localhost:8080/login/oauth2/code/google is in allowed redirect URIs
4. Backend must be running on port 8080
```

### "localStorage is empty after login"
```
Solution:
1. Check browser's Developer Tools → Application → Local Storage
2. Verify login response includes user object with role
3. Try logging out and logging back in
4. Clear browser cache if needed
```

---

## 📝 Environment Configuration

### Backend (application.properties)
```properties
spring.application.name=DemoApplication
spring.data.mongodb.uri=mongodb+srv://paf:paf123@cluster0.0vfmwfr.mongodb.net/smart_campus_db?retryWrites=true&w=majority
spring.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

### Frontend (package.json)
```json
{
  "proxy": "http://localhost:8080",
  "dependencies": {
    "react": "^19.2.4",
    "react-router-dom": "^7.14.0",
    "react-icons": "^5.2.1"
  }
}
```

---

## 🔍 Debug Tips

1. **Check Backend Logs**: Look for @PreAuthorize errors or compilation issues
2. **Check Console Errors**: Use browser DevTools → Console for frontend errors
3. **Check localStorage**: DevTools → Application → Local Storage
4. **Test API Directly**: Use Postman or PowerShell Invoke-RestMethod
5. **Check Role in Database**: Query MongoDB users collection directly
6. **Enable Debug Logs**: Add logging to ProtectedRoute component

---

## 📞 Support

### If OAuth isn't working:
1. Check Google credentials in application.properties
2. Verify redirect URI in Google Cloud Console
3. Check browser console for JavaScript errors
4. Check backend logs for Spring Security errors

### If role-based access isn't working:
1. Verify user role in MongoDB
2. Check @PreAuthorize annotations in AdminController
3. Verify @EnableMethodSecurity is enabled in SecurityConfig
4. Logout and login again to refresh token

### If ProtectedRoute isn't working:
1. Check localStorage is populated after login
2. Verify ProtectedRoute component is imported correctly
3. Check role in user object matches requiredRole array
4. Clear browser cache and try again

---

**Last Updated**: April 19, 2026
**Version**: 1.0.0
**Status**: Production Ready
