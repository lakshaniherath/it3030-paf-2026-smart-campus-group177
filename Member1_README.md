# Member 1: Facilities & Assets Catalogue (Resource Management)

## Module Overview
This module acts as the core foundational catalog for the Smart Campus Operations Hub. It handles the CRUD operations for bookable resources such as Lecture Halls, Labs, Meeting Rooms, and Equipment.
It exposes a robust RESTful API intended for wide consumption by Frontend UI and other backend services (e.g., Booking, Maintenance).

## Key Features
- **Resource Management**: Complete Create, Read, Update, Delete (Soft-delete/Deactivate) functionality.
- **Rich Data Model**: Features capacity, location, resource type, operational status, and time availability windows.
- **Dynamic Search via API**: The endpoints allow complex filtering based on types, query strings, capacity, and current status.
- **Global Error Handling**: Standardized JSON responses for API errors.

## Tech Stack
- **Backend**: Spring Boot, Spring Data MongoDB, Spring Web
- **Frontend**: React, Tailwind CSS

## Integration Guide for Members
1. **Model Reuse**: Refer to the `Resource` model when linking bookings. Bookings should simply reference the `resourceId` string.
2. **Checking Status**: Before allowing a booking, use `GET /api/resources/{id}` to ensure the `status` is `ACTIVE`.
3. **Soft Delete Concept**: This module uses soft deletes. `DELETE /api/resources/{id}` sets the status to `INACTIVE`. Other members' modules won't break if a resource is deleted, because the record remains in the database for historical referencing.

## Setup Instructions
1. MongoDB server must be running on your local / cloud equivalent.
2. Import `Member1_Resources_Postman_Collection.json` into Postman to test backend independently.
3. Incorporate the React components inside `frontend/src/features/resources` into the main `App.jsx` router.
