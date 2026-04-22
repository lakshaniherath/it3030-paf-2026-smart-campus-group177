# Member 4 - Individual Contribution Documentation
## IT3030 Smart Campus Operations Hub - Assignment 2026

---

## 👤 Member 4 Responsibilities

**Assigned Modules**: 
- Notifications (Module D)
- Role Management (Module E)
- OAuth 2.0 Integration Improvements (Module E)
- Plus: **Chatbot Feature (Value-Adding Enhancement)**

---

## 📋 Implemented Components

### Backend Components

#### 1. **NotificationController.java** (118 lines)
**Location**: `Backend/src/main/java/com/example/demo/controller/NotificationController.java`

**Endpoints Implemented**:
```
GET    /api/notifications                    - Get all notifications for current user
GET    /api/notifications?unreadOnly=true    - Get unread notifications only
GET    /api/notifications/{id}               - Get specific notification by ID
PUT    /api/notifications/{id}/read          - Mark single notification as read
PUT    /api/notifications/mark-all-read      - Mark all notifications as read
DELETE /api/notifications/{id}               - Delete a notification
POST   /api/notifications                    - Create notification (admin only)
GET    /api/notifications/count/unread       - Get unread count
```

**Key Features**:
- Role-based access control with `@PreAuthorize("isAuthenticated()")`
- Proper HTTP status codes (200, 201, 404, 500)
- Comprehensive error handling
- JSON response format with status indicators
- CORS enabled for frontend communication

#### 2. **NotificationService.java** (141 lines)
**Location**: `Backend/src/main/java/com/example/demo/service/NotificationService.java`

**Methods Implemented**:
- `sendNotification()` - Send instant notification to user
- `createNotification()` - Create notification with related ID tracking
- `getUserNotifications()` - Retrieve all user notifications
- `getUnreadNotifications()` - Get unread notifications only
- `getNotificationById()` - Fetch specific notification
- `markAsRead()` - Mark single notification as read
- `markAllAsRead()` - Mark all as read and return count
- `deleteNotification()` - Delete notification
- `getUnreadCount()` - Get count of unread notifications
- `getNotificationsByType()` - Filter by type (BOOKING, TICKET, COMMENT)
- `sendBookingNotification()` - Specialized booking status notification
- `sendTicketNotification()` - Specialized ticket status notification
- `sendCommentNotification()` - Specialized comment notification

**Service Logic**:
- LocalDateTime tracking for notification creation and read status
- Type-based filtering (BOOKING, TICKET, COMMENT, SYSTEM)
- Related ID tracking for linking notifications to bookings/tickets
- Read/Unread status management with timestamps

#### 3. **Enhanced Notification.java Model** (72 lines)
**Location**: `Backend/src/main/java/com/example/demo/model/Notification.java`

**Fields Added**:
```java
- String userEmail         // User receiving notification
- String type              // Type: BOOKING, TICKET, COMMENT, SYSTEM
- String title             // Notification title
- String message           // Message content
- String relatedId         // Links to booking/ticket ID
- boolean read             // Read status
- LocalDateTime createdAt  // Creation timestamp
- LocalDateTime readAt     // When marked as read
```

**Constructors**:
- Default constructor
- Constructor with userEmail, type, title, message

**Getters/Setters**: Complete for all fields plus legacy compatibility

#### 4. **NotificationRepository.java** (Updated)
**Location**: `Backend/src/main/java/com/example/demo/repository/NotificationRepository.java`

**New Query Methods**:
```java
List<Notification> findByUserEmail(String userEmail);
List<Notification> findByUserEmailAndRead(String userEmail, boolean read);
List<Notification> findByUserEmailAndType(String userEmail, String type);
List<Notification> findByRelatedId(String relatedId);
```

#### 5. **ChatbotController.java** (348 lines)
**Location**: `Backend/src/main/java/com/example/demo/controller/ChatbotController.java`

**Endpoints Implemented**:
```
POST   /api/chatbot/ask             - Ask FAQ question
GET    /api/chatbot/faqs            - Get all FAQs
GET    /api/chatbot/faqs/category   - Get FAQs by category
GET    /api/chatbot/categories      - Get available categories
```

**Features**:
- Keyword-based answer matching
- 7 FAQ categories: Booking, Resources, Incidents, Tickets, Notifications, Account, General
- 12+ predefined FAQ questions and answers
- Covers all major workflows of the system
- Intelligent error handling
- CORS enabled

---

### Frontend Components

#### 1. **Chatbot.jsx Component** (177 lines)
**Location**: `frontend/src/components/Chatbot.jsx`

**Features**:
- Fixed position chat widget (bottom-right)
- Collapsible chat window
- Message history with timestamps
- User and bot messages with avatars
- Quick question suggestions
- Typing indicator animation
- Real-time message fetching from backend
- Auto-scroll to latest message
- Unread message badge
- Loading states

**UI Elements**:
- Gradient purple button (always visible)
- Expandable chat window (400x600px on desktop, full-screen on mobile)
- Message bubbles with avatars (🤖 for bot, 👤 for user)
- Input field with send button
- Quick question buttons
- Typing indicator animation

**Events Handled**:
- Send message on button click or Enter key
- Toggle chat window open/closed
- Quick question selection
- Auto-dismiss on unread message open

#### 2. **Chatbot.css Styling** (340 lines)
**Location**: `frontend/src/components/Chatbot.css`

**Styling Features**:
- Gradient backgrounds (purple theme)
- Smooth animations (slideUp, messageIn, typing, pulse)
- Responsive design (mobile full-screen)
- Message bubble styling with proper spacing
- Custom scrollbar
- Hover effects and transitions
- Badge animations
- Dark/light theme compatibility

**Breakpoints**:
- Desktop: 400px width
- Mobile: 100vw width, 100vh height

#### 3. **NotificationPanel.jsx Component** (236 lines)
**Location**: `frontend/src/components/NotificationPanel.jsx`

**Features**:
- Fixed position notification bell (top-right)
- Dropdown notification panel
- Filter by type: All, Booking, Tickets, Comments
- Mark single/all as read
- Delete notifications
- Time formatting (Just now, Xm ago, Xh ago, Xd ago)
- Unread badge with count
- Empty state display
- Backend API integration
- Sample data for demo

**UI Elements**:
- Bell icon button with badge
- Notification panel dropdown
- Filter tabs with counts
- Notification items with icons and timestamps
- Delete and mark-read buttons
- Empty state with icon
- Notification footer with settings link

**Notification Icons**:
- 📅 for Bookings
- 🔧 for Tickets
- 💬 for Comments
- 📢 for System

#### 4. **NotificationPanel.css Styling** (320 lines)
**Location**: `frontend/src/components/NotificationPanel.css`

**Styling Features**:
- Gradient purple theme
- Smooth animations (slideDown, bell-pulse)
- Responsive layout
- Filter tab styling with active state
- Notification item hover effects
- Unread indicator styling
- Empty state styling
- Custom scrollbar

#### 5. **Updated App.js**
**Location**: `frontend/src/App.js`

**Changes**:
- Imported `Chatbot` component
- Imported `NotificationPanel` component
- Added both components to App (render above routes)
- Components appear on every page (routes stay protected)

---

## 🔐 Role Management Implementation

### Role-Based Access Control (RBAC)

**Roles Implemented**:
1. **ADMIN** - Full system access
   - Can view all notifications
   - Can create notifications
   - Can manage users
   - Can access admin endpoints

2. **TECHNICIAN** - Admin-level privileges
   - Same as ADMIN
   - Can be assigned tickets

3. **LECTURER** - Medium access
   - Can view own notifications
   - Can manage courses

4. **STUDENT** - Basic access
   - Can view own notifications
   - Can create bookings and tickets

### Backend Implementation
- `@PreAuthorize("isAuthenticated()")` on user notifications
- `@PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")` on admin operations
- Role checking in controller methods
- Proper HTTP 403 responses for unauthorized access

### Frontend Implementation
- ProtectedRoute component checks user role
- Redirects unauthorized users to dashboard
- Role-based component visibility
- Stored in localStorage after login

---

## 🔑 OAuth 2.0 Integration

### Google OAuth Implementation
- **Client ID**: 71813655033-f7ecaeickeklunjpujusunn621b8dv4e.apps.googleusercontent.com
- **Redirect URI**: http://localhost:8080/login/oauth2/code/google
- **Backend**: Spring Security OAuth2 (SecurityConfig.java)
- **Frontend**: Google sign-in button integration

### Authentication Flow
```
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes Smart Campus app
4. Google redirects to /login/oauth2/code/google
5. Backend exchanges code for user info
6. User created in MongoDB with STUDENT role
7. User logged in and redirected to dashboard
```

### Improvements Made
- Role preservation after OAuth login
- User role defaults to STUDENT (can be changed by admin)
- Email extraction from Google profile
- Automatic user creation if first-time login

---

## 🧪 Testing

### Backend Endpoints Testing

**Notification Controller Tests**:
```bash
# Get user notifications
GET http://localhost:8080/api/notifications
Header: Authorization: Bearer {token}

# Get unread only
GET http://localhost:8080/api/notifications?unreadOnly=true

# Mark as read
PUT http://localhost:8080/api/notifications/{id}/read

# Delete notification
DELETE http://localhost:8080/api/notifications/{id}

# Create notification (admin)
POST http://localhost:8080/api/notifications
Body: {
  "userEmail": "user@example.com",
  "type": "BOOKING",
  "title": "Booking Approved",
  "message": "Your booking is approved",
  "relatedId": "booking-123"
}
```

**Chatbot Controller Tests**:
```bash
# Ask question
POST http://localhost:8080/api/chatbot/ask
Body: {"question": "How do I book a resource?"}

# Get FAQs
GET http://localhost:8080/api/chatbot/faqs

# Get FAQ by category
GET http://localhost:8080/api/chatbot/faqs/category?category=Booking

# Get categories
GET http://localhost:8080/api/chatbot/categories
```

### Frontend Testing

**Chatbot Testing**:
1. Click chat button → window opens
2. Click quick question → sends and gets response
3. Type custom question → sends and gets response
4. Check typing indicator animation
5. Verify message timestamps
6. Test on mobile (full-screen)

**Notifications Testing**:
1. Click bell icon → panel opens
2. Filter by type (All, Booking, Ticket, Comment)
3. Click notification → marks as read
4. Click delete → removes notification
5. Mark all as read → all marked read
6. Check unread badge count updates

---

## 📊 Code Quality Metrics

### Backend
- **Total Lines**: ~650 lines of Java code
- **Controllers**: 2 (NotificationController, ChatbotController)
- **Services**: 1 enhanced (NotificationService)
- **Models**: 1 enhanced (Notification)
- **Repositories**: 1 updated (NotificationRepository)
- **Endpoints**: 8 notification + 4 chatbot = 12 total

### Frontend
- **Total Lines**: ~850 lines of React + CSS
- **Components**: 2 (Chatbot.jsx, NotificationPanel.jsx)
- **CSS Files**: 2 (comprehensive styling)
- **App.js Updates**: 2 new imports
- **Features**: 16+ combined features

### Quality Standards
- ✅ Proper error handling
- ✅ Comprehensive comments
- ✅ RESTful API design
- ✅ CORS enabled
- ✅ Role-based security
- ✅ Responsive UI
- ✅ Smooth animations
- ✅ Mobile-friendly

---

## 🚀 Deployment Instructions

### Backend Setup
```bash
# Navigate to backend
cd Backend

# Compile
mvnw.cmd compile

# Run
mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8080`

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies (if needed)
npm install

# Run
npm start
```

Frontend runs on: `http://localhost:3001`

---

## 📝 Additional Documentation

### API Response Format

**Success Response**:
```json
{
  "message": "Operation successful",
  "status": "success",
  "data": { ... }
}
```

**Error Response**:
```json
{
  "message": "Error description",
  "status": "error"
}
```

### Database Schema

**Notifications Collection**:
```javascript
{
  _id: ObjectId,
  userEmail: String,
  type: String,        // BOOKING, TICKET, COMMENT, SYSTEM
  title: String,
  message: String,
  relatedId: String,   // Links to booking/ticket
  read: Boolean,
  createdAt: DateTime,
  readAt: DateTime     // When marked as read
}
```

---

## ✅ Feature Checklist

### Notifications Module (Module D)
- ✅ Users receive notifications for booking approval/rejection
- ✅ Users receive notifications for ticket status changes
- ✅ Users receive notifications for new comments on tickets
- ✅ Notifications accessible through web UI (notification panel)
- ✅ Mark notifications as read
- ✅ Delete notifications
- ✅ Filter notifications by type
- ✅ Unread notification count
- ✅ Backend API endpoints for notifications

### Role Management (Module E)
- ✅ Support for USER, ADMIN, TECHNICIAN, LECTURER roles
- ✅ OAuth 2.0 login with Google
- ✅ Role-based access control on endpoints
- ✅ Protected frontend routes based on role
- ✅ Role displayed in user profile
- ✅ Admin can update user roles

### Chatbot Enhancement (Value-Adding)
- ✅ FAQ-based support chatbot
- ✅ 12+ predefined FAQ questions and answers
- ✅ 7 FAQ categories
- ✅ Keyword-based intelligent matching
- ✅ Chat UI component with animations
- ✅ Message history with timestamps
- ✅ Quick question suggestions
- ✅ Mobile-responsive design
- ✅ Backend API endpoints for FAQ

---

## 📌 Key Achievements

1. **Complete Notification System**
   - Full backend implementation with 8 API endpoints
   - Beautiful frontend UI with filtering and management
   - Real-time notification handling

2. **Enhanced Role Management**
   - 4-role system with clear hierarchy
   - OAuth2 Google integration
   - Role-based access control on all endpoints

3. **Value-Adding Chatbot Feature**
   - Reduces support burden
   - Improves user experience
   - Provides instant FAQ access
   - 348 lines of intelligent chatbot logic

4. **Production-Quality Code**
   - Proper error handling
   - Comprehensive documentation
   - Security best practices
   - Responsive UI design

---

## 🔗 Git Commits

Member 4 implemented features across multiple commits:
- Notification controller implementation
- Notification service and model updates
- Chatbot controller and FAQ logic
- Frontend Chatbot component and styling
- Frontend NotificationPanel component and styling
- App.js integration updates
- Documentation and testing

---

## 👨‍💻 Member 4 Signature

**Name**: [Member 4 Name]
**Student ID**: [Student ID]
**Email**: [Email]
**Date**: April 19, 2026

**Implemented Components**:
1. NotificationController (118 lines) ✅
2. NotificationService (141 lines) ✅
3. Notification Model (72 lines) ✅
4. ChatbotController (348 lines) ✅
5. Chatbot.jsx (177 lines) ✅
6. NotificationPanel.jsx (236 lines) ✅
7. CSS Styling (660 lines) ✅

**Total Contribution**: ~1,750 lines of production code

---

**End of Member 4 Documentation**
