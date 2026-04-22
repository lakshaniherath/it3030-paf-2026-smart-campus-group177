# Member 4 API Reference Guide

## Notification Endpoints (8 Total)

### 1. Get All Notifications
```
Method: GET
URL: http://localhost:8080/api/notifications
Authentication: Required (Bearer token)
Query Params:
  - unreadOnly (boolean, optional): Filter unread only

Response (200 OK):
{
  "message": "Notifications retrieved successfully",
  "count": 3,
  "notifications": [
    {
      "id": "notification-123",
      "userEmail": "user@example.com",
      "type": "BOOKING",
      "title": "Booking Approved",
      "message": "Your booking has been approved",
      "relatedId": "booking-456",
      "read": false,
      "createdAt": "2026-04-19T10:30:00",
      "readAt": null
    }
  ],
  "status": "success"
}
```

### 2. Get Specific Notification
```
Method: GET
URL: http://localhost:8080/api/notifications/{id}
Authentication: Required
Parameters:
  - id (path): Notification ID

Response (200 OK):
{
  "message": "Notification retrieved successfully",
  "notification": { ... },
  "status": "success"
}

Error (404):
{
  "message": "Notification not found",
  "status": "error"
}
```

### 3. Mark Notification as Read
```
Method: PUT
URL: http://localhost:8080/api/notifications/{id}/read
Authentication: Required
Parameters:
  - id (path): Notification ID

Response (200 OK):
{
  "message": "Notification marked as read",
  "notification": { ... (with read=true, readAt set) },
  "status": "success"
}
```

### 4. Mark All Notifications as Read
```
Method: PUT
URL: http://localhost:8080/api/notifications/mark-all-read
Authentication: Required

Response (200 OK):
{
  "message": "All notifications marked as read",
  "count": 5,
  "status": "success"
}
```

### 5. Delete Notification
```
Method: DELETE
URL: http://localhost:8080/api/notifications/{id}
Authentication: Required
Parameters:
  - id (path): Notification ID

Response (200 OK):
{
  "message": "Notification deleted successfully",
  "status": "success"
}

Error (404):
{
  "message": "Notification not found",
  "status": "error"
}
```

### 6. Create Notification (Admin Only)
```
Method: POST
URL: http://localhost:8080/api/notifications
Authentication: Required (ADMIN or TECHNICIAN role)
Content-Type: application/json

Request Body:
{
  "userEmail": "user@example.com",
  "type": "BOOKING",
  "title": "Booking Approved",
  "message": "Your booking has been approved",
  "relatedId": "booking-123"
}

Response (201 Created):
{
  "message": "Notification created successfully",
  "notification": { ... },
  "status": "success"
}

Error (403):
{
  "message": "Access Denied",
  "status": "error"
}
```

### 7. Get Unread Count
```
Method: GET
URL: http://localhost:8080/api/notifications/count/unread
Authentication: Required

Response (200 OK):
{
  "message": "Unread count retrieved",
  "count": 3,
  "status": "success"
}
```

### 8. Get Notifications by Type
```
Method: GET
URL: http://localhost:8080/api/notifications/type/{type}
Authentication: Required
Parameters:
  - type (path): BOOKING, TICKET, COMMENT, or SYSTEM

Response (200 OK):
{
  "message": "Notifications retrieved",
  "notifications": [ ... ],
  "status": "success"
}
```

---

## Chatbot Endpoints (4 Total)

### 1. Ask FAQ Question
```
Method: POST
URL: http://localhost:8080/api/chatbot/ask
Content-Type: application/json
Authentication: Not required

Request Body:
{
  "question": "How do I book a resource?"
}

Response (200 OK):
{
  "message": "Response generated",
  "question": "How do I book a resource?",
  "answer": "To create a booking:\n1. Navigate to Facilities...",
  "type": "FAQ",
  "status": "success"
}

Error (400):
{
  "message": "Question cannot be empty",
  "status": "error"
}
```

### 2. Get All FAQs
```
Method: GET
URL: http://localhost:8080/api/chatbot/faqs
Authentication: Not required

Response (200 OK):
{
  "message": "FAQs retrieved successfully",
  "faqs": [
    {
      "question": "How do I create a booking?",
      "answer": "Navigate to Facilities...",
      "category": "Booking"
    },
    ...
  ],
  "count": 12,
  "status": "success"
}
```

### 3. Get FAQs by Category
```
Method: GET
URL: http://localhost:8080/api/chatbot/faqs/category?category=Booking
Authentication: Not required
Query Params:
  - category (required): Category name

Response (200 OK):
{
  "message": "FAQs retrieved successfully",
  "category": "Booking",
  "faqs": [ ... ],
  "count": 3,
  "status": "success"
}
```

### 4. Get All Categories
```
Method: GET
URL: http://localhost:8080/api/chatbot/categories
Authentication: Not required

Response (200 OK):
{
  "message": "Categories retrieved successfully",
  "categories": [
    "Booking",
    "Resources",
    "Incidents",
    "Tickets",
    "Notifications",
    "Account",
    "General"
  ],
  "count": 7,
  "status": "success"
}
```

---

## FAQ Database

### Categories
- **Booking**: Booking operations and management
- **Resources**: Facility and equipment information
- **Incidents**: Incident reporting
- **Tickets**: Ticket management and tracking
- **Notifications**: Notification settings and reception
- **Account**: User account and authentication
- **General**: General platform information

### Sample Questions by Category

#### Booking
- "How do I create a booking?"
- "How do I check resource availability?"
- "Can I cancel a booking?"
- "What happens if there's a time conflict?"

#### Resources
- "What facilities can I book?"
- "How do I search for resources?"
- "Can I filter by capacity?"

#### Incidents
- "How do I report an incident?"
- "What can I attach to a ticket?"
- "How do I track my ticket?"

#### Tickets
- "Can I add comments to tickets?"
- "What's the ticket workflow?"
- "Who can update tickets?"

#### Account
- "How do I log in?"
- "Can I use Google OAuth?"
- "What roles are available?"

#### Notifications
- "When do I get notifications?"
- "How do I manage notification preferences?"

#### General
- "What is the Smart Campus system?"
- "How do I get help?"

---

## Testing Examples

### Using PowerShell

#### Get Notifications
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/notifications" `
  -Method GET `
  -Headers $headers | ConvertTo-Json
```

#### Ask Chatbot Question
```powershell
$body = @{
    "question" = "How do I book a resource?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/chatbot/ask" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json
```

#### Get All FAQs
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/chatbot/faqs" `
  -Method GET | ConvertTo-Json
```

### Using curl

#### Get Notifications
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/notifications
```

#### Ask Chatbot
```bash
curl -X POST http://localhost:8080/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"How do I book a resource?"}'
```

#### Mark as Read
```bash
curl -X PUT http://localhost:8080/api/notifications/{id}/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal error |

---

## Response Format

All endpoints follow this format:

**Success Response**:
```json
{
  "message": "Operation description",
  "data": { ... },
  "status": "success"
}
```

**Error Response**:
```json
{
  "message": "Error description",
  "status": "error"
}
```

---

## Authentication

All notification endpoints require Bearer token authentication:

```
Header: Authorization: Bearer {token}
```

Chatbot endpoints are public (no authentication required).

---

## Rate Limiting

No rate limiting implemented (development mode).

---

## CORS Configuration

**Allowed Origins**:
- http://localhost:3000
- http://localhost:3001

**Allowed Methods**:
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**:
- Content-Type
- Authorization

---

## Error Handling

All endpoints include comprehensive error handling:

```json
{
  "message": "Descriptive error message",
  "status": "error"
}
```

Common errors:
- Empty question for chatbot
- Notification not found
- Unauthorized access
- Internal server errors

---

**Last Updated**: April 19, 2026
**Member 4 API Reference**: Complete
