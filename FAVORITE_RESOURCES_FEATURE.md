# Favorite Resources Feature - Member 2 Special Feature

## Overview
The Favorite Resources feature allows users to mark resources as favorites for quick access, view booking history, and quickly book their preferred resources.

## Features Implemented

### 1. Backend API Endpoints
**Location:** `Backend/src/main/java/com/example/demo/member2/controller/FavoriteResourceController.java`

- `GET /api/member2/favorites` - Get user's favorite resource IDs
- `POST /api/member2/favorites/{resourceId}` - Add resource to favorites
- `DELETE /api/member2/favorites/{resourceId}` - Remove resource from favorites
- `GET /api/member2/favorites/check/{resourceId}` - Check if resource is favorited

### 2. Database Schema Update
**Location:** `Backend/src/main/java/com/example/demo/model/User.java`

Added `favoriteResources` field to User model:
```java
private List<String> favoriteResources = new ArrayList<>();
```

### 3. Frontend Components

#### FavoritesPanel Component
**Location:** `frontend/src/components/member2/FavoritesPanel.jsx`

Features:
- Display all favorite resources in a grid layout
- Show booking statistics for each favorite resource (Total, Approved, Pending)
- Display recent bookings (last 3) for each favorite
- Quick book button - navigates to booking page with resource pre-selected
- Remove from favorites functionality
- Empty state with call-to-action to browse resources

#### Integration with BookingManagement
**Location:** `frontend/src/components/member2/BookingManagement.jsx`

- Added "My Favorites" navigation item in sidebar
- Integrated FavoritesPanel as a new section
- Users can access favorites from the booking module

#### Integration with ResourceDetailsPage
**Location:** `frontend/src/features/resources/pages/ResourceDetailsPage.jsx`

- Added "Add to Favorites" / "Remove from Favorites" button
- Star icon fills when resource is favorited
- Button shows loading state during API calls
- Checks favorite status on page load

## User Flow

### Adding a Favorite
1. User navigates to a resource detail page
2. Clicks "Add to Favorites" button (star icon)
3. Resource is added to their favorites list
4. Button changes to "Remove from Favorites" with filled star

### Viewing Favorites
1. User navigates to Booking Management (`/bookings`)
2. Clicks "My Favorites" in the sidebar
3. Sees all favorite resources with:
   - Resource details (name, location, capacity, status)
   - Booking statistics (total, approved, pending bookings)
   - Recent booking history (last 3 bookings)
   - Quick action buttons (Quick Book, Details)

### Quick Booking from Favorites
1. User clicks "Quick Book" on a favorite resource
2. Navigates to booking creation form
3. Resource is pre-selected in the form
4. User fills in date, time, and other details
5. Submits booking request

### Removing a Favorite
1. From Favorites Panel: Click the filled star icon next to resource name
2. From Resource Details: Click "Remove from Favorites" button
3. Resource is removed from favorites list

## Technical Details

### Authentication
- Uses `X-User-Email` header for user identification
- Reads user data from `localStorage.getItem('user')`

### Data Persistence
- Favorites are stored in MongoDB User collection
- Persists across sessions
- Synced with backend on every page load

### API Integration
- Uses axios for HTTP requests
- Handles loading and error states
- Provides user feedback for all operations

## Benefits

1. **Quick Access** - Users can quickly find and book their frequently used resources
2. **Booking History** - Track usage patterns for favorite resources
3. **Time Saving** - Pre-selected resources in booking form
4. **Personalization** - Each user has their own favorites list
5. **Analytics** - View booking statistics per resource

## Testing Checklist

- [ ] Add resource to favorites from detail page
- [ ] Remove resource from favorites from detail page
- [ ] View favorites in Booking Management
- [ ] See booking statistics for favorite resources
- [ ] View recent bookings for favorite resources
- [ ] Quick book from favorites panel
- [ ] Remove favorite from favorites panel
- [ ] Verify favorites persist after logout/login
- [ ] Test with multiple users (favorites are user-specific)
- [ ] Test empty state when no favorites exist

## Future Enhancements

1. Add favorite resources to dashboard
2. Sort favorites by most used, recently added, etc.
3. Export favorite resources list
4. Share favorite resources with other users
5. Add notes/tags to favorite resources
6. Notification when favorite resource becomes available
