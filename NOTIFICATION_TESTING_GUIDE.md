# Notification System Testing Guide

## Overview
This guide helps you test the complete notification workflow for bookings and tickets.

## What Was Fixed

### 1. Booking Notifications
- ✅ When user creates a booking → Admin receives notification
- ✅ When admin approves booking → User receives notification
- ✅ When admin rejects booking → User receives notification (with reason)

### 2. Ticket Notifications
- ✅ When user creates a ticket → Admin and Technicians receive notification
- ✅ When status changes (OPEN → IN_PROGRESS → RESOLVED → CLOSED) → Reporter receives notification

### 3. Auto-Refresh
- ✅ Notification panel now auto-refreshes every 10 seconds
- ✅ No need to manually refresh to see new notifications

## Testing Steps

### Test 1: Booking Creation Notification

**Steps:**
1. Login as a regular user (e.g., `technician@example.com` / `Tech123`)
2. Go to Bookings → New Booking
3. Create a new booking request
4. Logout

5. Login as admin (`admin@example.com` / `Admin123`)
6. Click the cyan notification bell in top-right corner
7. You should see a notification: "New Booking Request"

**Expected Result:**
- Admin sees notification with booking details
- Notification type: BOOKING
- Shows user name, resource, date, and time

### Test 2: Booking Approval Notification

**Steps:**
1. As admin, go to Bookings section
2. Find a PENDING booking
3. Click the green checkmark to approve
4. Logout

5. Login as the user who created the booking
6. Click the notification bell
7. You should see: "Booking APPROVED"

**Expected Result:**
- User receives approval notification
- Shows resource name and booking date
- Notification type: BOOKING

### Test 3: Booking Rejection Notification

**Steps:**
1. As admin, go to Bookings section
2. Find a PENDING booking
3. Click the red X to reject
4. Enter rejection reason (e.g., "Resource under maintenance")
5. Submit rejection
6. Logout

7. Login as the user who created the booking
8. Click the notification bell
9. You should see: "Booking REJECTED"

**Expected Result:**
- User receives rejection notification
- Shows rejection reason
- Notification type: BOOKING

### Test 4: Ticket Creation Notification

**Steps:**
1. Login as a regular user
2. Go to Tickets → Report Incident
3. Create a new ticket with:
   - Resource/Location
   - Description
   - Priority
   - Optional: Upload images
4. Submit ticket
5. Logout

6. Login as admin or technician
7. Click the notification bell
8. You should see: "New Ticket Created"

**Expected Result:**
- Admin/Technician sees notification
- Shows priority and description
- Notification type: TICKET

### Test 5: Ticket Status Change Notification

**Steps:**
1. As admin/technician, go to Tickets
2. Find a ticket and click Details
3. Change status (e.g., OPEN → IN_PROGRESS)
4. Logout

5. Login as the user who created the ticket
6. Click the notification bell
7. You should see: "Ticket Status Updated: IN_PROGRESS"

**Expected Result:**
- User receives status change notification
- Shows old status → new status
- Notification type: TICKET

### Test 6: Auto-Refresh

**Steps:**
1. Login as user A in one browser
2. Login as admin in another browser
3. As user A, create a booking
4. Wait 10 seconds (don't click anything)
5. Admin's notification bell should update automatically

**Expected Result:**
- Unread count badge appears/updates automatically
- No manual refresh needed

## Notification Panel Features

### Filter Tabs
- **All**: Shows all notifications
- **Bookings**: Only booking-related notifications
- **Tickets**: Only ticket-related notifications
- **Comments**: Only comment-related notifications (ready for future use)

### Actions
- **Click notification**: Marks as read
- **Mark all as read**: Clears all unread notifications
- **Delete icon**: Removes individual notification
- **Time display**: Shows "5m ago", "2h ago", etc.

### Visual Indicators
- 📅 Booking notifications
- 🔧 Ticket notifications
- 💬 Comment notifications
- Blue dot: Unread notification
- Red badge: Unread count

## Troubleshooting

### Notifications Not Appearing

**Check 1: User Email**
- Ensure users have email addresses in the database
- Check localStorage: `localStorage.getItem('user')`
- Should have `email` field

**Check 2: Backend Logs**
- Check Spring Boot console for errors
- Look for: "Failed to send notification"

**Check 3: Database**
- Check MongoDB notifications collection
- Verify notifications are being created

**Check 4: Auto-Refresh**
- Wait 10 seconds for auto-refresh
- Or manually refresh the page

### Notification Not Showing for Specific User

**Check:**
1. User's email matches the one in notification
2. User is logged in with correct account
3. Check browser console for errors
4. Try logging out and back in

### Unread Count Not Updating

**Solution:**
- Wait 10 seconds for auto-refresh
- Or close and reopen notification panel
- Or refresh the page

## API Endpoints for Manual Testing

### Get Notifications
```bash
GET http://localhost:8080/api/notifications
Header: X-User-Email: user@example.com
```

### Get Unread Count
```bash
GET http://localhost:8080/api/notifications/count/unread
Header: X-User-Email: user@example.com
```

### Mark as Read
```bash
PUT http://localhost:8080/api/notifications/{id}/read
```

### Create Test Notification
```bash
POST http://localhost:8080/api/notifications
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "type": "BOOKING",
  "title": "Test Notification",
  "message": "This is a test message",
  "relatedId": "test123"
}
```

## Database Queries

### Check Notifications in MongoDB
```javascript
// Connect to MongoDB
use your_database_name

// Find all notifications
db.notifications.find().pretty()

// Find notifications for specific user
db.notifications.find({ userEmail: "admin@example.com" }).pretty()

// Find unread notifications
db.notifications.find({ read: false }).pretty()

// Count notifications by type
db.notifications.aggregate([
  { $group: { _id: "$type", count: { $sum: 1 } } }
])
```

## Expected Notification Flow

### Booking Flow
```
User creates booking
    ↓
Admin receives notification: "New Booking Request"
    ↓
Admin approves/rejects
    ↓
User receives notification: "Booking APPROVED/REJECTED"
```

### Ticket Flow
```
User creates ticket
    ↓
Admin & Technicians receive notification: "New Ticket Created"
    ↓
Admin/Technician updates status
    ↓
User receives notification: "Ticket Status Updated"
```

## Success Criteria

✅ All notifications appear within 10 seconds  
✅ Unread count badge shows correct number  
✅ Notifications can be marked as read  
✅ Notifications can be deleted  
✅ Filter tabs work correctly  
✅ Time-ago formatting displays properly  
✅ Auto-refresh works without manual intervention  

## Notes

- Notifications are stored in MongoDB
- Auto-refresh interval: 10 seconds
- Notification panel is globally available on all pages
- Notifications persist until deleted by user
- Failed notifications don't break the main operation (booking/ticket creation)

---

**Last Updated:** April 25, 2026  
**Testing Status:** Ready for QA  
**Known Issues:** None
