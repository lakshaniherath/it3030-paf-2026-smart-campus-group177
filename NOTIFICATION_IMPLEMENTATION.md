# Notification System Implementation - Member 4

## Overview
This document describes the complete notification system implementation for the Smart Campus Operations Hub, fulfilling Module D requirements of the PAF Assignment 2026.

## Features Implemented

### 1. Backend REST API Endpoints (Spring Boot)

#### Notification Controller (`/api/notifications`)
Located at: `Backend/src/main/java/com/example/demo/controller/NotificationController.java`

**Endpoints Implemented:**

1. **GET /api/notifications**
   - Retrieves all notifications for the current user
   - Query parameter: `unreadOnly` (boolean) - filter for unread notifications only
   - Returns: List of notifications with count and status
   - Authentication: Required (via OAuth2 or X-User-Email header)

2. **GET /api/notifications/{id}**
   - Retrieves a specific notification by ID
   - Returns: Single notification object
   - Status: 404 if not found

3. **PUT /api/notifications/{id}/read**
   - Marks a specific notification as read
   - Updates the `readAt` timestamp
   - Returns: Updated notification object

4. **PUT /api/notifications/mark-all-read**
   - Marks all notifications as read for the current user
   - Returns: Count of notifications marked as read
   - Authentication: Required

5. **DELETE /api/notifications/{id}**
   - Deletes a specific notification
   - Returns: Success message
   - Status: 404 if not found

6. **POST /api/notifications**
   - Creates a new notification (admin/system use)
   - Request body: userEmail, type, title, message, relatedId
   - Returns: Created notification object
   - Status: 201 Created

7. **GET /api/notifications/count/unread**
   - Gets the count of unread notifications for current user
   - Returns: Integer count
   - Used for badge display in UI

8. **GET /api/notifications/type/{type}**
   - Filters notifications by type (BOOKING, TICKET, COMMENT)
   - Returns: Filtered list of notifications

### 2. Data Model

#### Notification Entity
Located at: `Backend/src/main/java/com/example/demo/model/Notification.java`

**Fields:**
- `id` (String): Unique identifier
- `userEmail` (String): Recipient email address
- `type` (String): Notification category (BOOKING, TICKET, COMMENT, SYSTEM)
- `title` (String): Notification title
- `message` (String): Detailed notification message
- `relatedId` (String): ID of related booking/ticket for navigation
- `read` (boolean): Read status (default: false)
- `createdAt` (LocalDateTime): Creation timestamp
- `readAt` (LocalDateTime): When notification was read

### 3. Service Layer

#### NotificationService
Located at: `Backend/src/main/java/com/example/demo/service/NotificationService.java`

**Key Methods:**
- `sendNotification()`: Send basic notification
- `createNotification()`: Create notification with related entity ID
- `getUserNotifications()`: Get all user notifications
- `getUnreadNotifications()`: Get unread notifications only
- `markAsRead()`: Mark single notification as read
- `markAllAsRead()`: Mark all user notifications as read
- `deleteNotification()`: Delete a notification
- `getUnreadCount()`: Get count of unread notifications
- `getNotificationsByType()`: Filter by notification type
- `sendBookingNotification()`: Helper for booking-related notifications
- `sendTicketNotification()`: Helper for ticket-related notifications
- `sendCommentNotification()`: Helper for comment-related notifications

### 4. Repository Layer

#### NotificationRepository
Located at: `Backend/src/main/java/com/example/demo/repository/NotificationRepository.java`

**Query Methods:**
- `findByUserEmail()`: Find all notifications for a user
- `findByUserEmailAndRead()`: Find notifications by read status
- `findByUserEmailAndType()`: Find notifications by type
- `findByRelatedId()`: Find notifications related to specific entity

### 5. Integration with Booking System

**Location:** `Backend/src/main/java/com/example/demo/member2/service/BookingService.java`

**Automatic Notifications Sent:**
- When admin **approves** a booking:
  - Title: "Booking APPROVED"
  - Message: Details of approved booking with date and resource
  - Type: BOOKING
  
- When admin **rejects** a booking:
  - Title: "Booking REJECTED"
  - Message: Includes rejection reason
  - Type: BOOKING

### 6. Integration with Ticket System

**Location:** `Backend/src/main/java/com/example/demo/member3/service/TicketService.java`

**Automatic Notifications Sent:**
- When ticket status changes (OPEN → IN_PROGRESS → RESOLVED → CLOSED):
  - Title: "Ticket Status Updated: {NEW_STATUS}"
  - Message: Shows old status → new status transition
  - Type: TICKET
  - Sent to: Original ticket reporter

### 7. Frontend Implementation

#### NotificationPanel Component
Located at: `frontend/src/components/NotificationPanel.jsx`

**Features:**
- Floating notification bell button (top-right corner)
- Real-time unread count badge with animation
- Slide-in notification panel
- Filter tabs: All, Bookings, Tickets, Comments
- Mark individual notifications as read (click)
- Mark all as read button
- Delete individual notifications
- Time-ago formatting (e.g., "5m ago", "2h ago")
- Visual indicators for unread notifications
- Emoji icons for different notification types:
  - 📅 Bookings
  - 🔧 Tickets
  - 💬 Comments
  - 📢 System

**Styling:**
- Modern, clean UI with Tailwind CSS
- Cyan/blue color scheme matching app theme
- Smooth animations and transitions
- Responsive design
- Scrollable notification list
- Hover effects and visual feedback

#### Integration in App
Located at: `frontend/src/App.js`

The NotificationPanel is globally available across all pages, appearing as a floating button in the top-right corner.

### 8. API Utility Functions

Located at: `frontend/src/utils/api.js`

The `apiFetch` utility handles:
- Authentication headers (OAuth2 token or X-User-Email)
- Error handling
- JSON parsing
- CORS configuration

## Technical Implementation Details

### Authentication & Authorization
- Supports OAuth 2.0 authentication
- Falls back to X-User-Email header for local development
- Role-based access control (USER, ADMIN, TECHNICIAN)
- Secure endpoint protection

### Database
- MongoDB for notification storage
- Indexed queries for performance
- Automatic timestamp management

### Error Handling
- Graceful error handling in notification sending
- Non-blocking: If notification fails, main operation succeeds
- Proper HTTP status codes (200, 201, 404, 401, 500)
- Meaningful error messages

### Best Practices Followed
1. **RESTful API Design:**
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Resource-based URLs
   - Appropriate status codes
   - JSON responses

2. **Clean Architecture:**
   - Layered structure (Controller → Service → Repository)
   - Separation of concerns
   - Dependency injection
   - Single responsibility principle

3. **Code Quality:**
   - Meaningful variable/method names
   - Proper error handling
   - Try-catch blocks for external operations
   - Comments for complex logic

4. **Security:**
   - Authentication required for all endpoints
   - User can only access their own notifications
   - Input validation
   - SQL injection prevention (using JPA)

5. **User Experience:**
   - Real-time notification count
   - Visual feedback for actions
   - Smooth animations
   - Intuitive UI
   - Responsive design

## Testing Evidence

### Manual Testing Scenarios

1. **Booking Approval Notification:**
   - Admin approves a pending booking
   - User receives notification with booking details
   - Notification appears in panel with unread badge

2. **Booking Rejection Notification:**
   - Admin rejects a booking with reason
   - User receives notification with rejection reason
   - Notification marked as BOOKING type

3. **Ticket Status Change Notification:**
   - Technician updates ticket status
   - Reporter receives notification
   - Shows status transition (e.g., OPEN → IN_PROGRESS)

4. **Mark as Read:**
   - Click on unread notification
   - Notification marked as read
   - Unread count decreases
   - Visual indicator removed

5. **Mark All as Read:**
   - Click "Mark all as read" button
   - All notifications marked as read
   - Unread count becomes 0

6. **Delete Notification:**
   - Click delete icon on notification
   - Notification removed from list
   - Count updated

7. **Filter by Type:**
   - Click filter tabs (All, Bookings, Tickets, Comments)
   - Only relevant notifications displayed
   - Count shown for each category

### API Testing (Postman/cURL)

```bash
# Get all notifications
GET http://localhost:8080/api/notifications
Header: X-User-Email: user@example.com

# Get unread notifications only
GET http://localhost:8080/api/notifications?unreadOnly=true
Header: X-User-Email: user@example.com

# Mark notification as read
PUT http://localhost:8080/api/notifications/{id}/read

# Get unread count
GET http://localhost:8080/api/notifications/count/unread
Header: X-User-Email: user@example.com

# Delete notification
DELETE http://localhost:8080/api/notifications/{id}
```

## Assignment Requirements Fulfillment

### Module D – Notifications ✅

✅ **Users receive notifications for:**
- Booking approval/rejection
- Ticket status changes
- New comments on tickets (infrastructure ready)

✅ **Notifications accessible through web UI:**
- Floating notification panel
- Always accessible from any page
- Visual unread count badge

✅ **Additional Features:**
- Filter by notification type
- Mark as read functionality
- Delete notifications
- Time-ago formatting
- Responsive design

### REST API Requirements ✅

✅ **Four different HTTP methods:**
1. GET - Retrieve notifications
2. POST - Create notification
3. PUT - Update notification (mark as read)
4. DELETE - Delete notification

✅ **RESTful best practices:**
- Resource-based URLs
- Proper HTTP status codes
- Meaningful error responses
- Consistent API naming

✅ **Database persistence:**
- MongoDB for notification storage
- Not in-memory collections

✅ **Security:**
- Authentication required
- Authorization checks
- Input validation

### Documentation ✅

✅ **Clear endpoint documentation**
✅ **Architecture diagrams** (can be added to final report)
✅ **Testing evidence** (this document + screenshots)
✅ **Individual contribution clearly marked** (Member 4)

## Future Enhancements (Optional)

1. **Real-time Notifications:**
   - WebSocket integration for instant notifications
   - Push notifications

2. **Notification Preferences:**
   - User settings to enable/disable notification types
   - Email notifications
   - Notification frequency settings

3. **Rich Notifications:**
   - Action buttons in notifications (Approve/Reject directly)
   - Inline replies
   - Attachments preview

4. **Analytics:**
   - Notification delivery rate
   - Read rate statistics
   - User engagement metrics

## Conclusion

The notification system is fully implemented and integrated with the booking and ticket modules. It provides a complete, production-ready solution that meets all assignment requirements for Module D and demonstrates best practices in REST API development, clean architecture, and user experience design.

**Member 4 Contribution:**
- 8 REST API endpoints (GET, POST, PUT, DELETE)
- Complete notification service layer
- Frontend notification panel component
- Integration with booking and ticket systems
- Comprehensive documentation

---

**Last Updated:** April 25, 2026
**Author:** Member 4 - Notification System
**Project:** Smart Campus Operations Hub (Group 177)
