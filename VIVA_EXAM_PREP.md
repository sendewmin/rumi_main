# RUMI BACKEND - VIVA EXAM PREPARATION GUIDE

## Overview
This document contains a comprehensive guide to all working endpoints in the RUMI backend, along with CRUD operations, testing methods, and concepts likely to be asked in the viva examination.

---

## TOTAL WORKING ENDPOINTS: 39

---

## API DEFINITION & TYPES

### What is an API?

**API** stands for **Application Programming Interface**. It is a set of rules and protocols that allows different software applications to communicate with each other.

**Definition:** An API acts as a bridge between different applications, allowing them to:
- Request data or functionality from each other
- Share data securely
- Perform operations on remote servers
- Integrate with other services

**Real-World Analogy:** 
Think of an API like a restaurant menu:
- **Menu** = API
- **Customer** = Client application
- **Restaurant** = Server/Backend
- **Waiter** = API endpoint
- **Order** = HTTP request
- **Meal** = Response/Data

When you order (make a request), the waiter (API endpoint) takes your order to the kitchen (server), processes it, and returns your meal (response).

### Types of APIs

#### 1. **REST API (Representational State Transfer)** ⭐ [USED IN RUMI]
**Most popular for web services**

Characteristics:
- Uses standard HTTP methods: GET, POST, PUT, DELETE, PATCH
- Resource-based URLs (nouns, not verbs)
- Stateless communication
- Standard HTTP status codes
- Lightweight and easy to understand
- Uses JSON format typically

Example:
```http
GET /api/rooms/1
POST /api/rooms
PUT /api/rooms/1
DELETE /api/rooms/1
```

**Advantages:**
- Simple and easy to learn
- Cacheable
- Scalable
- Browser-friendly
- Good for public APIs

**Disadvantages:**
- Over-fetching (more data than needed)
- Under-fetching (need multiple requests)
- No strong typing

---

#### 2. **SOAP API (Simple Object Access Protocol)**

Characteristics:
- Uses XML for data format
- Complex but very formal protocol
- WSDL (Web Services Description Language)
- Requires more bandwidth
- Stateful

Example:
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetRoom>
      <roomId>1</roomId>
    </GetRoom>
  </soap:Body>
</soap:Envelope>
```

**Advantages:**
- Highly standardized
- Built-in security features
- Good for enterprise applications

**Disadvantages:**
- Complex and verbose
- Overhead from XML
- Slower than REST
- Steeper learning curve

---

#### 3. **GraphQL API**

Characteristics:
- Client specifies exactly what data needed
- Single endpoint
- Solves over/under-fetching problems
- Strongly typed
- Uses queries and mutations

Example:
```graphql
query {
  room(id: 1) {
    roomTitle
    price
    city
    ratings {
      star
      comment
    }
  }
}
```

**Advantages:**
- No over/under-fetching
- Strongly typed
- Flexible data retrieval
- Reduces bandwidth

**Disadvantages:**
- Steeper learning curve
- Complex caching
- File uploads more complex
- Query complexity attacks

---

#### 4. **RPC API (Remote Procedure Call)**

Characteristics:
- Function-based (verb-oriented)
- Action-based endpoints
- Simpler than REST for certain use cases

Example:
```
POST /api/createRoom
POST /api/deleteRoom
POST /api/approveRoom
```

**Advantages:**
- Simple for simple operations
- Easy to understand

**Disadvantages:**
- Not RESTful
- Violates REST principles
- Can lead to inconsistent APIs
- Not scalable for large systems

---

#### 5. **gRPC API (Google Remote Procedure Call)**

Characteristics:
- Uses HTTP/2
- Protocol Buffers for serialization
- Fast and efficient
- For microservices
- Bidirectional streaming

Example:
```protobuf
service RoomService {
  rpc GetRoom (RoomRequest) returns (RoomResponse);
  rpc CreateRoom (RoomCreateRequest) returns (RoomResponse);
}
```

**Advantages:**
- Very fast
- Low latency
- Efficient bandwidth use
- Supports streaming

**Disadvantages:**
- Not browser-friendly
- Steeper learning curve
- Requires special tools
- Not human-readable

---

#### 6. **WebSocket API**

Characteristics:
- Persistent connection
- Two-way communication
- Real-time data
- Bidirectional

Example (Chat application):
```javascript
const socket = new WebSocket('ws://localhost:8080/chat');
socket.onmessage = (event) => {
  console.log('Message:', event.data);
};
socket.send('Hello!');
```

**Advantages:**
- Real-time communication
- Low latency
- Persistent connection
- Bidirectional

**Disadvantages:**
- More complex implementation
- Higher resource usage
- Harder to scale
- Not suitable for all use cases

---

#### 7. **Webhook API**

Characteristics:
- Event-driven
- Server pushes data to client
- Reverse of traditional API
- Callback URL

Example:
```
When room is approved:
POST https://your-app.com/webhook/room-approved
{
  "roomId": 1,
  "status": "APPROVED"
}
```

**Advantages:**
- Event-driven
- Real-time notifications
- Reduces polling

**Disadvantages:**
- Requires accessible endpoint
- Hard to debug
- Network issues can cause missed events

---

### Comparison Table

| Feature | REST | SOAP | GraphQL | gRPC | WebSocket |
|---------|------|------|---------|------|-----------|
| **Protocol** | HTTP | XML/SOAP | HTTP | HTTP/2 | TCP |
| **Data Format** | JSON/XML | XML | JSON | Protocol Buffers | JSON/Binary |
| **Complexity** | Low | High | Medium | High | Medium |
| **Performance** | Good | Moderate | Good | Excellent | Excellent |
| **Caching** | Yes | Limited | Complex | Limited | N/A |
| **Stateless** | Yes | No | Yes | Yes | No |
| **Real-time** | No | No | No | Yes | Yes |
| **Browser Support** | Yes | Yes | Yes | No | Yes |
| **Learning Curve** | Easy | Hard | Medium | Hard | Medium |

---

### API Architectural Styles

#### **REST vs RESTful**
- **REST**: Architectural style (principles)
- **RESTful**: An API that follows REST principles

A truly RESTful API follows these principles:
1. **Client-Server Architecture**: Separation of concerns
2. **Statelessness**: Each request is independent
3. **Uniform Interface**: Consistent resource identification
4. **Cacheability**: Responses should define themselves as cacheable or not
5. **Layered System**: Client shouldn't know if connected directly to end server
6. **Code on Demand** (optional): Server can extend client functionality

---

### RUMI Backend API Type: REST API ✅

**Why REST for RUMI?**
- ✅ Simple and straightforward
- ✅ Standard HTTP methods
- ✅ Widely understood
- ✅ Cacheable responses
- ✅ Scalable
- ✅ Good for mobile apps
- ✅ Browser-friendly
- ✅ Easy to test

**RUMI API Characteristics:**
- Base URL: `http://localhost:8080/api/`
- Data Format: JSON
- Authentication: Token-based (JWT)
- HTTP Methods: GET, POST, PUT, DELETE
- Status Codes: 2xx, 4xx, 5xx
- CORS: Enabled for cross-origin requests
- Framework: Spring Boot

---

### Common Interview Questions About API Types

**Q: What API type does RUMI use?**
A: REST API - Representational State Transfer API using HTTP protocol and JSON data format.

**Q: Why REST and not SOAP?**
A: REST is simpler, more modern, uses less bandwidth, and is easier to develop and test. SOAP is overly complex for web applications.

**Q: Why not GraphQL?**
A: REST is sufficient for RUMI's needs. GraphQL adds complexity without significant benefit for our use case. Would consider for future large-scale expansions.

**Q: What's the difference between REST and HTTP?**
A: HTTP is the protocol (rules for transmission), REST is the architectural style (how to use HTTP properly).

**Q: Can you have a non-HTTP REST API?**
A: Technically yes, REST principles aren't tightly bound to HTTP, but practically REST = HTTP on the web.

**Q: Is RUMI API truly RESTful?**
A: Mostly yes. Follows REST principles: resource-based URLs, standard HTTP methods, stateless, JSON responses. Could improve with HATEOAS (hypermedia) for full REST compliance.

**Q: What would you use WebSockets for in RUMI?**
A: Real-time features like live chat, instant notifications when room approved/rejected, real-time availability updates.

**Q: How would you migrate RUMI to GraphQL?**
A: Would require significant refactoring:
1. Define GraphQL schema
2. Create resolvers for queries/mutations
3. Replace REST endpoints
4. Update frontend queries
5. Implement Apollo client (or similar)

**Q: What's API versioning?**
A: Managing multiple API versions. Example: `/api/v1/rooms` vs `/api/v2/rooms`. Allows backward compatibility when making breaking changes.

**Q: Should RUMI use API versioning?**
A: Yes! Good practice. Current: `/api/rooms` could become `/api/v1/rooms` for future compatibility.

---



## TABLE OF CONTENTS
1. [API Definition & Types](#api-definition--types)
2. [Rooms Management (7 endpoints)](#rooms-management)
3. [Admin Dashboard (11 endpoints)](#admin-dashboard)
4. [Room Share Posts (6 endpoints)](#room-share-posts)
5. [Bookings (3 endpoints)](#bookings)
6. [Ratings & Reviews (5 endpoints)](#ratings--reviews)
7. [Wishlists (4 endpoints)](#wishlists)
8. [CRUD Operations Overview](#crud-operations-overview)
9. [Common Concepts & Interview Questions](#common-concepts--interview-questions)
10. [Authentication & Authorization](#authentication--authorization)
11. [Testing Strategies](#testing-strategies)

---

## ROOMS MANAGEMENT

### Base URL: `/api/rooms`

#### 1. CREATE ROOM (POST `/api/rooms`)
**CRUD Operation:** CREATE

**Description:** Create a new room listing

**Request:**
```http
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomTitle": "Cozy Studio",
  "description": "Beautiful studio apartment",
  "price": 50000,
  "city": "Tokyo",
  "country": "Japan",
  "genderAllowed": "ANY",
  "roomStatus": "AVAILABLE",
  "roomType": "STUDIO"
}
```

**Response:**
```json
{
  "roomId": 1
}
```

**HTTP Status Codes:**
- ✅ 201 CREATED - Room created successfully
- ❌ 400 BAD REQUEST - Invalid data
- ❌ 401 UNAUTHORIZED - Missing/invalid auth header
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Requires Authentication token in Authorization header
- User becomes the room owner
- Data validation is performed
- Returns roomId for future reference

**How to Test:**
```bash
curl -X POST http://localhost:8080/api/rooms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomTitle": "Cozy Studio",
    "price": 50000,
    "city": "Tokyo",
    "country": "Japan",
    "genderAllowed": "ANY",
    "roomStatus": "AVAILABLE",
    "roomType": "STUDIO"
  }'
```

---

#### 2. GET ROOM DETAILS (GET `/api/rooms/{roomId}`)
**CRUD Operation:** READ

**Description:** Retrieve detailed information about a specific room

**Request:**
```http
GET /api/rooms/1
```

**Response:**
```json
{
  "roomId": 1,
  "roomTitle": "Cozy Studio",
  "description": "Beautiful studio apartment",
  "price": 50000,
  "city": "Tokyo",
  "country": "Japan",
  "genderAllowed": "ANY",
  "roomStatus": "AVAILABLE",
  "roomType": "STUDIO",
  "ownerName": "John Doe",
  "averageRating": 4.5,
  "totalReviews": 10,
  "approvalStatus": "APPROVED",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Room found
- ❌ 404 NOT FOUND - Room not found
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- No authentication required
- Public endpoint
- Returns complete room details with rating info

**How to Test:**
```bash
curl -X GET http://localhost:8080/api/rooms/1
```

---

#### 3. GET MY LISTINGS (GET `/api/rooms/my-listings`)
**CRUD Operation:** READ

**Description:** Get all rooms created by the logged-in user

**Request:**
```http
GET /api/rooms/my-listings
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "roomId": 1,
    "roomTitle": "Cozy Studio",
    "price": 50000,
    "approvalStatus": "APPROVED"
  },
  {
    "roomId": 2,
    "roomTitle": "Spacious 2BR",
    "price": 80000,
    "approvalStatus": "PENDING"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Listings retrieved
- ❌ 401 UNAUTHORIZED - Invalid/missing token
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Requires Authentication
- Returns only user's own listings
- Includes approval status

**How to Test:**
```bash
curl -X GET http://localhost:8080/api/rooms/my-listings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 4. DELETE ROOM (DELETE `/api/rooms/{roomId}`)
**CRUD Operation:** DELETE

**Description:** Delete a room listing (owner only)

**Request:**
```http
DELETE /api/rooms/1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Room deleted successfully"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Room deleted
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not room owner
- ❌ 404 NOT FOUND - Room not found
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Requires Authentication
- Only room owner can delete
- Soft or hard delete depending on implementation

**How to Test:**
```bash
curl -X DELETE http://localhost:8080/api/rooms/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 5. SEARCH/FILTER ROOMS (GET `/api/rooms/search`)
**CRUD Operation:** READ

**Description:** Search and filter rooms with multiple criteria

**Request:**
```http
GET /api/rooms/search?city=Tokyo&minPrice=30000&maxPrice=100000&genderAllowed=ANY&roomStatus=AVAILABLE&page=0&size=10
```

**Query Parameters:**
- `city` (optional): Filter by city
- `country` (optional): Filter by country
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `genderAllowed` (optional): Gender preference (ANY, MALE_ONLY, FEMALE_ONLY)
- `roomStatus` (optional): AVAILABLE, UNAVAILABLE
- `roomType` (optional): STUDIO, ONE_BEDROOM, TWO_BEDROOM, etc.
- `page` (default: 0): Page number for pagination
- `size` (default: 10): Number of results per page

**Response:**
```json
{
  "content": [
    {
      "roomId": 1,
      "roomTitle": "Cozy Studio",
      "price": 50000,
      "city": "Tokyo",
      "country": "Japan",
      "genderAllowed": "ANY",
      "roomType": "STUDIO"
    }
  ],
  "totalElements": 50,
  "totalPages": 5,
  "currentPage": 0,
  "size": 10
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Search successful
- ❌ 400 BAD REQUEST - Invalid enum values
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- No authentication required
- Supports pagination
- Auto-normalizes text search (case-insensitive)
- Swaps min/max price if reversed
- Flexible filtering on multiple criteria

**How to Test:**
```bash
curl -X GET "http://localhost:8080/api/rooms/search?city=Tokyo&minPrice=30000&maxPrice=100000&genderAllowed=ANY&page=0&size=10"
```

---

#### 6. UPLOAD ROOM IMAGES (POST `/api/rooms/{roomId}/images`)
**CRUD Operation:** CREATE

**Description:** Upload multiple images for a room

**Request:**
```http
POST /api/rooms/1/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

form-data:
  image: [file1.jpg, file2.jpg, file3.jpg]
```

**Response:**
```json
{
  "message": "Room Image Added"
}
```

**HTTP Status Codes:**
- ✅ 201 CREATED - Images uploaded
- ❌ 401 UNAUTHORIZED - Invalid/missing token
- ❌ 403 FORBIDDEN - Only room owner can upload
- ❌ 404 NOT FOUND - Room not found
- ❌ 500 INTERNAL SERVER ERROR - Upload failed

**Key Points:**
- Requires Authentication
- Only room owner can upload
- Supports multiple files
- Images stored in Supabase Storage
- Validates image format and size

**How to Test (using curl):**
```bash
curl -X POST http://localhost:8080/api/rooms/1/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image1.jpg" \
  -F "image=@/path/to/image2.jpg"
```

**How to Test (using Postman):**
1. Method: POST
2. URL: `http://localhost:8080/api/rooms/1/images`
3. Headers: Authorization: Bearer YOUR_TOKEN
4. Body → form-data → Key: "image", Value: Select multiple files

---

#### 7. GET ROOM IMAGES (GET `/api/rooms/{roomId}/images`)
**CRUD Operation:** READ

**Description:** Retrieve all images for a specific room

**Request:**
```http
GET /api/rooms/1/images
```

**Response:**
```json
[
  {
    "imageId": 1,
    "roomId": 1,
    "imageUrl": "https://storage.example.com/image1.jpg",
    "uploadedAt": "2024-01-15T10:30:00Z"
  },
  {
    "imageId": 2,
    "roomId": 1,
    "imageUrl": "https://storage.example.com/image2.jpg",
    "uploadedAt": "2024-01-15T10:31:00Z"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Images retrieved
- ❌ 404 NOT FOUND - Room not found
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- No authentication required
- Returns list of image URLs
- Images served from Supabase Storage
- Empty list if no images

**How to Test:**
```bash
curl -X GET http://localhost:8080/api/rooms/1/images
```

---

## ADMIN DASHBOARD

### Base URL: `/api/admin`
**Note:** All admin endpoints require authentication and admin role

#### 1. GET PENDING LISTINGS (GET `/api/admin/listings/pending`)
**CRUD Operation:** READ

**Description:** Retrieve all listings awaiting approval

**Request:**
```http
GET /api/admin/listings/pending?page=0&size=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:**
```json
{
  "content": [
    {
      "roomId": 5,
      "roomTitle": "New Studio",
      "city": "Tokyo",
      "price": 45000,
      "approvalStatus": "PENDING",
      "submittedAt": "2024-01-20T15:00:00Z"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "size": 10
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Listings retrieved
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Admin only
- Paginated results
- Shows only PENDING status rooms

---

#### 2. APPROVE LISTING (PUT `/api/admin/listings/{roomId}/approve`)
**CRUD Operation:** UPDATE

**Description:** Approve a pending room listing

**Request:**
```http
PUT /api/admin/listings/5/approve
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "message": "Listing approved successfully",
  "roomId": 5
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Approved
- ❌ 400 BAD REQUEST - Invalid room ID
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Admin only
- Updates room status to APPROVED
- User gets notification

---

#### 3. REJECT LISTING (PUT `/api/admin/listings/{roomId}/reject`)
**CRUD Operation:** UPDATE

**Description:** Reject a pending room listing with reason

**Request:**
```http
PUT /api/admin/listings/5/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Images are not clear"
}
```

**Response:**
```json
{
  "message": "Listing rejected successfully",
  "roomId": 5,
  "reason": "Images are not clear"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Rejected
- ❌ 400 BAD REQUEST - Invalid request
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Admin only
- Requires reason in body
- Updates room status to REJECTED
- User receives notification with reason

---

#### 4. GET ALL LISTINGS WITH STATUS (GET `/api/admin/listings`)
**CRUD Operation:** READ

**Description:** Get all listings with optional status filter

**Request:**
```http
GET /api/admin/listings?status=APPROVED&page=0&size=10
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `status` (optional): PENDING, APPROVED, REJECTED
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:**
```json
{
  "content": [
    {
      "roomId": 1,
      "roomTitle": "Cozy Studio",
      "approvalStatus": "APPROVED"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Listings retrieved
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

#### 5. GET APPROVAL STATISTICS (GET `/api/admin/statistics`)
**CRUD Operation:** READ

**Description:** Get statistics on room approvals

**Request:**
```http
GET /api/admin/statistics
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "totalListings": 100,
  "pendingCount": 15,
  "approvedCount": 80,
  "rejectedCount": 5,
  "verificationPendingCount": 3
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Statistics retrieved
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin

---

#### 6. GET ALL USERS (GET `/api/admin/users`)
**CRUD Operation:** READ

**Description:** Retrieve paginated list of all users

**Request:**
```http
GET /api/admin/users?page=0&size=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "content": [
    {
      "userId": "user123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "isBanned": false,
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "totalElements": 250,
  "totalPages": 25
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Users retrieved
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

#### 7. BAN USER (PUT `/api/admin/users/{userId}/ban`)
**CRUD Operation:** UPDATE

**Description:** Ban a user from the platform

**Request:**
```http
PUT /api/admin/users/user123/ban
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "message": "User banned successfully",
  "userId": "user123"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - User banned
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Admin only
- User cannot access platform after ban
- User's listings may be affected

---

#### 8. UNBAN USER (PUT `/api/admin/users/{userId}/unban`)
**CRUD Operation:** UPDATE

**Description:** Remove ban from a user

**Request:**
```http
PUT /api/admin/users/user123/unban
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "message": "User unbanned successfully",
  "userId": "user123"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - User unbanned
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin

---

#### 9. SETUP ADMIN USER (POST `/api/admin/setup/create-admin-user`)
**CRUD Operation:** CREATE

**Description:** Create admin user from Supabase token (one-time setup)

**Request:**
```http
POST /api/admin/setup/create-admin-user
Authorization: Bearer {supabase_token}
```

**Response:**
```json
{
  "message": "Admin user created/updated successfully"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Admin user created
- ❌ 401 UNAUTHORIZED - Invalid token
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- One-time setup endpoint
- Requires valid Supabase token
- Creates admin role user

---

#### 10. CREATE ADMIN DIRECTLY (POST `/api/admin/setup/create-admin-direct`)
**CRUD Operation:** CREATE

**Description:** Create admin user directly (development/initial setup)

**Request:**
```http
POST /api/admin/setup/create-admin-direct
Content-Type: application/json

{
  "userId": "admin123",
  "email": "admin@example.com",
  "fullName": "Admin User"
}
```

**Response:**
```json
{
  "message": "Admin user created successfully"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Admin created
- ❌ 400 BAD REQUEST - Missing userId or email
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- For development/initial setup
- No authentication required
- Requires userId and email at minimum

---

#### 11. GET ROOMS AWAITING VERIFICATION (GET `/api/admin/rooms/verification-pending`)
**CRUD Operation:** READ

**Description:** Get all rooms pending verification

**Request:**
```http
GET /api/admin/rooms/verification-pending?page=0&size=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "content": [
    {
      "roomId": 8,
      "roomTitle": "Premium Apartment",
      "city": "Tokyo",
      "verificationStatus": "PENDING"
    }
  ],
  "totalElements": 5,
  "totalPages": 1
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Rooms retrieved
- ❌ 401 UNAUTHORIZED - Not authenticated
- ❌ 403 FORBIDDEN - Not admin
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

## ROOM SHARE POSTS

### Base URL: `/api/room-share-posts`

#### 1. GET ALL POSTS (GET `/api/room-share-posts`)
**CRUD Operation:** READ

**Description:** Retrieve all room share posts

**Request:**
```http
GET /api/room-share-posts
```

**Response:**
```json
[
  {
    "postId": 1,
    "userId": "user456",
    "title": "Looking for roommate",
    "description": "2BR apartment in central Tokyo",
    "location": "Tokyo",
    "genderPreference": "FEMALE_ONLY",
    "rent": 40000,
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Posts retrieved
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- No authentication required
- Returns all active posts

---

#### 2. CREATE POST (POST `/api/room-share-posts`)
**CRUD Operation:** CREATE

**Description:** Create a new room share post

**Request:**
```http
POST /api/room-share-posts
Content-Type: application/json

{
  "userId": "user456",
  "title": "Looking for roommate",
  "description": "2BR apartment in central Tokyo",
  "location": "Tokyo",
  "genderPreference": "FEMALE_ONLY",
  "rent": 40000
}
```

**Response:**
```json
{
  "postId": 1,
  "userId": "user456",
  "title": "Looking for roommate",
  "location": "Tokyo",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**HTTP Status Codes:**
- ✅ 201 CREATED - Post created
- ❌ 400 BAD REQUEST - Invalid data
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

#### 3. FILTER POSTS (GET `/api/room-share-posts/filter`)
**CRUD Operation:** READ

**Description:** Filter room share posts with pagination

**Request:**
```http
GET /api/room-share-posts/filter?location=Tokyo&genderPreference=FEMALE_ONLY&maxRent=50000&page=0&size=10
```

**Query Parameters:**
- `location` (optional): Filter by location
- `genderPreference` (optional): ANY, MALE_ONLY, FEMALE_ONLY
- `maxRent` (optional): Maximum rent price
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:**
```json
{
  "content": [
    {
      "postId": 1,
      "title": "Looking for roommate",
      "location": "Tokyo",
      "rent": 40000,
      "genderPreference": "FEMALE_ONLY"
    }
  ],
  "totalElements": 15,
  "totalPages": 2
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Filtered results
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

#### 4. GET POST (GET `/api/room-share-posts/{postId}`)
**CRUD Operation:** READ

**Description:** Get a specific room share post

**Request:**
```http
GET /api/room-share-posts/1
```

**Response:**
```json
{
  "postId": 1,
  "userId": "user456",
  "title": "Looking for roommate",
  "description": "2BR apartment in central Tokyo",
  "location": "Tokyo",
  "genderPreference": "FEMALE_ONLY",
  "rent": 40000,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Post found
- ❌ 404 NOT FOUND - Post not found
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

#### 5. UPDATE POST (PUT `/api/room-share-posts/{postId}`)
**CRUD Operation:** UPDATE

**Description:** Update a room share post

**Request:**
```http
PUT /api/room-share-posts/1
Content-Type: application/json

{
  "title": "Updated title",
  "rent": 42000,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "postId": 1,
  "title": "Updated title",
  "rent": 42000,
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Post updated
- ❌ 404 NOT FOUND - Post not found
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

#### 6. DELETE POST (DELETE `/api/room-share-posts/{postId}`)
**CRUD Operation:** DELETE

**Description:** Delete a room share post

**Request:**
```http
DELETE /api/room-share-posts/1
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Post deleted
- ❌ 404 NOT FOUND - Post not found
- ❌ 500 INTERNAL SERVER ERROR - Server error

---

## BOOKINGS

### Base URL: `/api/bookings`

#### 1. CREATE BOOKING (POST `/api/bookings`)
**CRUD Operation:** CREATE

**Description:** Create a new booking for a room

**Request:**
```http
POST /api/bookings
Content-Type: application/json

{
  "user_id": "user789",
  "room_id": 1,
  "status": "confirmed"
}
```

**Response:**
```json
{
  "bookingId": 101,
  "userId": "user789",
  "roomId": 1,
  "status": "confirmed",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**HTTP Status Codes:**
- ✅ 201 CREATED - Booking created
- ❌ 400 BAD REQUEST - Missing user_id or room_id
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Status field is optional (defaults to "confirmed")
- Creates record of user booking a room

---

#### 2. CHECK EXISTING BOOKING (GET `/api/bookings/check/{userId}/{roomId}`)
**CRUD Operation:** READ

**Description:** Check if a user already has a booking for a room

**Request:**
```http
GET /api/bookings/check/user789/1
```

**Response:**
```json
{
  "exists": true
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Check complete
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Returns boolean status
- Prevents duplicate bookings

---

#### 3. GET USER BOOKINGS (GET `/api/bookings/user/{userId}`)
**CRUD Operation:** READ

**Description:** Retrieve all bookings for a specific user

**Request:**
```http
GET /api/bookings/user/user789
```

**Response:**
```json
[
  {
    "bookingId": 101,
    "roomId": 1,
    "roomTitle": "Cozy Studio",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "bookingId": 102,
    "roomId": 5,
    "roomTitle": "Spacious 2BR",
    "status": "completed",
    "createdAt": "2024-01-20T10:00:00Z"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Bookings retrieved
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Returns all bookings for user
- Empty array if no bookings

---

## RATINGS & REVIEWS

### Base URL: `/api/ratings`

#### 1. SUBMIT RATING (POST `/api/ratings`)
**CRUD Operation:** CREATE

**Description:** Submit a rating and review for a room

**Request:**
```http
POST /api/ratings
Content-Type: application/json

{
  "user_id": "user789",
  "room_id": 1,
  "stars": 4,
  "comment": "Great room, very clean!",
  "tags": "clean,quiet,safe"
}
```

**Response:**
```json
{
  "ratingId": 201,
  "userId": "user789",
  "roomId": 1,
  "stars": 4,
  "comment": "Great room, very clean!",
  "tags": "clean,quiet,safe",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**HTTP Status Codes:**
- ✅ 201 CREATED - Rating submitted
- ❌ 400 BAD REQUEST - Missing required fields (user_id, room_id, stars)
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Stars required (1-5 typically)
- Comment and tags are optional
- User can only rate once per room

---

#### 2. CHECK IF USER RATED (GET `/api/ratings/check/{userId}/{roomId}`)
**CRUD Operation:** READ

**Description:** Check if user has already rated a specific room

**Request:**
```http
GET /api/ratings/check/user789/1
```

**Response:**
```json
{
  "exists": true
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Check complete
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Prevents duplicate ratings
- Returns boolean

---

#### 3. GET ROOM RATINGS (GET `/api/ratings/room/{roomId}`)
**CRUD Operation:** READ

**Description:** Retrieve all ratings for a specific room

**Request:**
```http
GET /api/ratings/room/1
```

**Response:**
```json
[
  {
    "ratingId": 201,
    "userId": "user789",
    "stars": 4,
    "comment": "Great room, very clean!",
    "tags": "clean,quiet,safe",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "ratingId": 202,
    "userId": "user456",
    "stars": 5,
    "comment": "Excellent location!",
    "tags": "safe,convenient",
    "createdAt": "2024-01-16T10:00:00Z"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Ratings retrieved
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Returns all ratings for the room
- Empty array if no ratings

---

#### 4. GET RATING STATISTICS (GET `/api/ratings/room/{roomId}/stats`)
**CRUD Operation:** READ

**Description:** Get rating statistics for a room

**Request:**
```http
GET /api/ratings/room/1/stats
```

**Response:**
```json
{
  "totalRatings": 10,
  "averageRating": 4.2,
  "fiveStarCount": 6,
  "fourStarCount": 3,
  "threeStarCount": 1,
  "twoStarCount": 0,
  "oneStarCount": 0
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Statistics retrieved
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Aggregated data per room
- Helpful for room listing display

---

#### 5. GET ROOM REVIEWS (GET `/api/ratings/room/{roomId}/reviews`)
**CRUD Operation:** READ

**Description:** Get all reviews (ratings with comments) for a room

**Request:**
```http
GET /api/ratings/room/1/reviews
```

**Response:**
```json
[
  {
    "ratingId": 201,
    "userId": "user789",
    "stars": 4,
    "comment": "Great room, very clean!",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Reviews retrieved
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Similar to GET ratings but focused on reviews with comments
- Excludes ratings without comments

---

## WISHLISTS

### Base URL: `/api/wishlists`

#### 1. ADD TO WISHLIST (POST `/api/wishlists`)
**CRUD Operation:** CREATE

**Description:** Add a room to user's wishlist

**Request:**
```http
POST /api/wishlists
Content-Type: application/json

{
  "user_id": "user789",
  "room_id": 1
}
```

**Response:**
```json
{
  "wishlistId": 301,
  "userId": "user789",
  "roomId": 1,
  "addedAt": "2024-01-15T10:00:00Z"
}
```

**HTTP Status Codes:**
- ✅ 201 CREATED - Added to wishlist
- ❌ 400 BAD REQUEST - Missing user_id or room_id
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Creates bookmark/favorite for room
- User can add same room multiple times (prevented by logic)

---

#### 2. REMOVE FROM WISHLIST (DELETE `/api/wishlists/{userId}/{roomId}`)
**CRUD Operation:** DELETE

**Description:** Remove a room from user's wishlist

**Request:**
```http
DELETE /api/wishlists/user789/1
```

**Response:**
```json
{
  "message": "Room removed from wishlist"
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Removed
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Removes bookmark
- Idempotent operation (safe to call multiple times)

---

#### 3. CHECK IF IN WISHLIST (GET `/api/wishlists/{userId}/{roomId}/exists`)
**CRUD Operation:** READ

**Description:** Check if a room is in user's wishlist

**Request:**
```http
GET /api/wishlists/user789/1/exists
```

**Response:**
```json
{
  "exists": true
}
```

**HTTP Status Codes:**
- ✅ 200 OK - Check complete
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Returns boolean
- Used to update UI (heart icon, etc.)

---

#### 4. GET USER WISHLISTS (GET `/api/wishlists/user/{userId}`)
**CRUD Operation:** READ

**Description:** Get all wishlisted rooms for a user

**Request:**
```http
GET /api/wishlists/user/user789
```

**Response:**
```json
[
  {
    "wishlistId": 301,
    "roomId": 1,
    "roomTitle": "Cozy Studio",
    "price": 50000,
    "city": "Tokyo",
    "addedAt": "2024-01-15T10:00:00Z"
  },
  {
    "wishlistId": 302,
    "roomId": 5,
    "roomTitle": "Spacious 2BR",
    "price": 80000,
    "city": "Osaka",
    "addedAt": "2024-01-16T10:00:00Z"
  }
]
```

**HTTP Status Codes:**
- ✅ 200 OK - Wishlists retrieved
- ❌ 500 INTERNAL SERVER ERROR - Server error

**Key Points:**
- Returns all wishlist items with room details
- Empty array if no wishlists
- Useful for saved/favorites page

---

## CRUD OPERATIONS OVERVIEW

### What is CRUD?

**CRUD** stands for **Create, Read, Update, Delete** - the four fundamental operations for managing persistent data in any application.

**Definition:** CRUD represents the minimum set of operations needed to perform basic database and data manipulation tasks. Every data-driven application implements these operations, whether explicitly or implicitly.

**Why CRUD?**
- Standardized operations across systems
- Covers all basic data management needs
- Foundation for database design
- Essential for API design
- Easy to understand and implement

### CRUD Operations Breakdown

#### 1. **CREATE** (C)
**Definition:** The operation of inserting or adding new data records to the database.

**HTTP Method:** `POST`
- Sends data to the server
- Server creates new resource
- Returns 201 CREATED status
- New resource gets unique ID

**Characteristics:**
- Not idempotent (multiple calls create multiple records)
- Requires data in request body
- Returns created resource with ID
- Can fail if data is invalid

**Example:**
```http
POST /api/rooms
Content-Type: application/json

{
  "roomTitle": "Cozy Studio",
  "price": 50000,
  "city": "Tokyo"
}

Response: 201 CREATED
{
  "roomId": 1,
  "roomTitle": "Cozy Studio",
  "price": 50000,
  "city": "Tokyo",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Real-World Example:**
- Creating a new room listing
- Adding user to wishlist
- Creating booking
- Submitting a review

---

#### 2. **READ** (R)
**Definition:** The operation of retrieving or fetching existing data from the database without modifying it.

**HTTP Method:** `GET`
- Retrieves data from server
- Does NOT modify data
- Returns 200 OK status
- Can be cached safely

**Characteristics:**
- Idempotent (multiple calls return same result)
- No request body typically
- Can include query parameters for filtering
- Safe operation (doesn't change data)

**Types of READ:**

a) **Read Single Resource:**
```http
GET /api/rooms/1

Response: 200 OK
{
  "roomId": 1,
  "roomTitle": "Cozy Studio",
  "price": 50000,
  "city": "Tokyo",
  "rating": 4.5
}
```

b) **Read All Resources (with pagination):**
```http
GET /api/wishlists/user/user789

Response: 200 OK
[
  {
    "wishlistId": 301,
    "roomId": 1,
    "roomTitle": "Cozy Studio",
    "addedAt": "2024-01-15T10:00:00Z"
  },
  {
    "wishlistId": 302,
    "roomId": 5,
    "roomTitle": "Spacious 2BR",
    "addedAt": "2024-01-16T10:00:00Z"
  }
]
```

c) **Read with Filtering/Search:**
```http
GET /api/rooms/search?city=Tokyo&minPrice=30000&maxPrice=100000&page=0&size=10

Response: 200 OK
{
  "content": [
    { "roomId": 1, "roomTitle": "Cozy Studio", "price": 50000 },
    { "roomId": 2, "roomTitle": "Modern Apartment", "price": 75000 }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0
}
```

d) **Read with Check (Boolean Response):**
```http
GET /api/wishlists/user789/1/exists

Response: 200 OK
{
  "exists": true
}
```

**Real-World Example:**
- View room details
- Search for rooms
- Get user's bookings
- Check ratings
- View wishlist

---

#### 3. **UPDATE** (U)
**Definition:** The operation of modifying existing data records in the database.

**HTTP Methods:**
- `PUT`: Replace entire resource
- `PATCH`: Partially modify resource

**PUT vs PATCH:**

| Aspect | PUT | PATCH |
|--------|-----|-------|
| **Scope** | Full replacement | Partial update |
| **Body** | All fields | Only changed fields |
| **Idempotent** | Yes | Yes (typically) |
| **Bandwidth** | More (full object) | Less (only fields) |
| **Safety** | Risk of losing data if missing fields | Safer |

**Characteristics:**
- Idempotent (multiple calls have same effect)
- Requires ID of resource to update
- Returns 200 OK with updated resource
- Can fail if resource doesn't exist (404)
- Can fail if data invalid (400)

**PUT Example (Full Update):**
```http
PUT /api/room-share-posts/1
Content-Type: application/json

{
  "title": "Updated title",
  "rent": 42000,
  "genderPreference": "FEMALE_ONLY",
  "location": "Tokyo",
  "description": "Updated description"
}

Response: 200 OK
{
  "postId": 1,
  "title": "Updated title",
  "rent": 42000,
  "genderPreference": "FEMALE_ONLY",
  "location": "Tokyo",
  "description": "Updated description",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**PATCH Example (Partial Update):**
```http
PATCH /api/room-share-posts/1
Content-Type: application/json

{
  "rent": 42000
}

Response: 200 OK
{
  "postId": 1,
  "title": "Original title",
  "rent": 42000,
  "genderPreference": "FEMALE_ONLY",
  "location": "Tokyo",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Note:** RUMI uses only PUT for updates (not PATCH)

**Real-World Example:**
- Update room details
- Edit room share post
- Change booking status
- Modify user profile

---

#### 4. **DELETE** (D)
**Definition:** The operation of removing or erasing data records from the database.

**HTTP Method:** `DELETE`
- Removes resource from server
- Returns 200 OK or 204 No Content
- Can be soft delete (mark as deleted) or hard delete (actually remove)

**Characteristics:**
- Idempotent (server usually doesn't error on deleting non-existent resource)
- No request body typically
- Can fail if resource doesn't exist (404)
- Can fail if user doesn't have permission (403)
- Returns 200 OK or 204 No Content

**DELETE Example:**
```http
DELETE /api/rooms/1
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Room deleted successfully"
}
```

**Alternative Response:**
```http
Response: 204 No Content
(Empty body)
```

**Soft Delete vs Hard Delete:**

| Aspect | Soft Delete | Hard Delete |
|--------|------------|-----------|
| **Physical Removal** | No | Yes |
| **Data Recovery** | Can recover | Cannot recover |
| **Database lookup** | Adds filter (WHERE deleted=false) | Direct removal |
| **Referential Integrity** | Easier to maintain | Harder with foreign keys |
| **Audit Trail** | Can track deletion | History lost |
| **Performance** | Slower (more data in DB) | Faster queries |

**Real-World Example:**
- Delete room listing
- Remove from wishlist
- Cancel booking
- Remove rating/review

---

### CRUD Operations Mapping Overview

| Operation | HTTP | Verb | Effect | Safe | Idempotent | Cacheable |
|-----------|------|------|--------|------|------------|-----------|
| CREATE | POST | Action | New resource | No | No | No |
| READ | GET | Fetch | No change | Yes | Yes | Yes |
| UPDATE | PUT | Replace | Modified data | No | Yes | No |
| UPDATE | PATCH | Modify | Partial change | No | Yes | No |
| DELETE | DELETE | Remove | Data removed | No | Yes | No |

**Definitions:**
- **Safe:** Operation doesn't modify server state
- **Idempotent:** Multiple identical calls = single call effect
- **Cacheable:** Response can be stored for reuse

---

### CRUD Mapping in RUMI Backend

**Rooms:**
- CREATE: `POST /api/rooms` - Creates new room listing
- READ: `GET /api/rooms/{id}`, `GET /api/rooms/search`, `GET /api/rooms/my-listings` - Retrieves room data
- UPDATE: None (rooms not directly updatable; delete and recreate)
- DELETE: `DELETE /api/rooms/{id}` - Removes room listing

**Room Share Posts:**
- CREATE: `POST /api/room-share-posts` - Creates new post
- READ: `GET /api/room-share-posts`, `GET /api/room-share-posts/{id}`, `GET /api/room-share-posts/filter` - Retrieves posts
- UPDATE: `PUT /api/room-share-posts/{id}` - Modifies post
- DELETE: `DELETE /api/room-share-posts/{id}` - Removes post

**Ratings:**
- CREATE: `POST /api/ratings` - Submits new rating
- READ: `GET /api/ratings/room/{id}`, `GET /api/ratings/room/{id}/stats`, `GET /api/ratings/room/{id}/reviews` - Retrieves ratings
- UPDATE: None (ratings immutable)
- DELETE: None (ratings not deletable)

**Bookings:**
- CREATE: `POST /api/bookings` - Creates new booking
- READ: `GET /api/bookings/user/{userId}`, `GET /api/bookings/check/{userId}/{roomId}` - Retrieves bookings
- UPDATE: None (bookings immutable by policy)
- DELETE: None (bookings archived, not deleted)

**Wishlists:**
- CREATE: `POST /api/wishlists` - Adds room to wishlist
- READ: `GET /api/wishlists/user/{userId}`, `GET /api/wishlists/{userId}/{roomId}/exists` - Retrieves wishlist items
- UPDATE: None (wishlist items binary)
- DELETE: `DELETE /api/wishlists/{userId}/{roomId}` - Removes from wishlist

**Admin Operations:**
- CREATE: `POST /api/admin/setup/*` - Creates admin user
- READ: `GET /api/admin/listings`, `GET /api/admin/users`, etc. - Retrieves data
- UPDATE: `PUT /api/admin/listings/{id}/approve`, `PUT /api/admin/listings/{id}/reject`, `PUT /api/admin/users/{id}/ban` - Modifies status
- DELETE: None (records archived)

---

---

## COMMON CONCEPTS & INTERVIEW QUESTIONS

### 1. REST API Fundamentals

**Q: What is REST?**
A: REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on HTTP protocol and uses:
- Standard HTTP methods: GET, POST, PUT, DELETE, PATCH
- Resource-based URLs (nouns, not verbs): `/api/rooms` not `/api/getRooms`
- Stateless communication
- Standard status codes

**Q: What are HTTP Status Codes?**
A:
- 2xx (Success): 200 OK, 201 Created, 204 No Content
- 3xx (Redirection): 301 Moved Permanently, 302 Found
- 4xx (Client Error): 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- 5xx (Server Error): 500 Internal Server Error, 503 Service Unavailable

**Q: What's the difference between POST and PUT?**
A:
- POST: Creates new resource. Idempotent? NO. Multiple calls create multiple resources
- PUT: Updates entire resource. Idempotent? YES. Multiple calls have same effect

**Q: What's PATCH vs PUT?**
A:
- PUT: Replaces entire resource (full update)
- PATCH: Partially updates resource. Not used in RUMI backend

### 2. Authentication & Authorization

**Q: What's the difference between Authentication and Authorization?**
A:
- Authentication: Verifying WHO you are (login with credentials)
- Authorization: Verifying WHAT you can do (admin rights)

**Q: How is authentication implemented in RUMI?**
A:
- Uses Supabase for authentication
- Token-based: JWT (JSON Web Tokens) in Authorization header
- Format: `Authorization: Bearer {token}`
- Token contains user info and is verified server-side

**Q: What's the Authorization header?**
A:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- "Bearer" indicates token-based authentication
- Token is JWT containing user ID, role, expiration time
- Must be sent in every authenticated request

### 3. Database Concepts

**Q: What's the difference between SQL and NoSQL?**
A:
- SQL: Relational databases (PostgreSQL, MySQL). Structured, ACID compliant
- NoSQL: Document/Key-value stores (MongoDB). Flexible schema, eventual consistency

**Q: What's normalization?**
A: Process of organizing database to reduce redundancy and improve data integrity. Multiple normal forms (1NF, 2NF, 3NF)

**Q: What are relationships in databases?**
A:
- One-to-One: 1 user has 1 profile
- One-to-Many: 1 room has Many bookings
- Many-to-Many: Students and Courses (need junction table)

**Q: What's a foreign key?**
A: A field that references primary key in another table. Maintains referential integrity.

### 4. Spring Boot Framework

**Q: What is Spring Boot?**
A: Framework built on Spring for building production-grade applications with minimal configuration. Provides:
- Auto-configuration
- Embedded servers
- Production-ready features

**Q: What's an @RestController?**
A: Annotation for REST API endpoints. Combines @Controller and @ResponseBody
- @Controller: Returns view
- @RestController: Returns JSON/XML data

**Q: What's @RequestMapping?**
A: Maps HTTP requests to handler methods. Can be at class or method level.
- Class level: Base path for all methods
- Method level: Specific endpoint

**Q: What's the difference between @RequestBody and @PathVariable?**
A:
- @PathVariable: Extracts value from URL path. `/api/rooms/{roomId}` - roomId from URL
- @RequestBody: Extracts value from request body. JSON payload in POST/PUT

**Q: What's @RequestParam?**
A: Extracts query parameters from URL. `/api/rooms/search?city=Tokyo` - city is @RequestParam

### 5. API Design Principles

**Q: What makes a good API endpoint?**
A:
- Clear and intuitive: `/api/rooms/{id}` is better than `/api/r/{i}`
- Consistent naming: Use nouns for resources, not verbs
- Versioning: `/api/v1/rooms` allows future versions
- Documentation: Clear documentation with examples

**Q: What's pagination?**
A: Dividing large result sets into pages to improve performance
```
/api/rooms/search?page=0&size=10
```
- page: Starting page (0-indexed)
- size: Number of items per page

**Q: What's filtering vs sorting?**
A:
- Filtering: Return subset based on criteria. `/api/rooms/search?city=Tokyo`
- Sorting: Order results. `/api/rooms/search?sortBy=price&order=asc`

### 6. Error Handling

**Q: What's proper error handling?**
A:
- Return appropriate HTTP status codes
- Include error message in response body
- Log errors for debugging
- Don't expose sensitive internal information

**Q: How should errors be formatted?**
A:
```json
{
  "error": "User not found",
  "statusCode": 404,
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### 7. Security Concepts

**Q: What's CORS?**
A: Cross-Origin Resource Sharing. Allows requests from different domains.
```java
@CrossOrigin(origins = "*", allowedHeaders = "*")
```

**Q: What are common security vulnerabilities?**
A:
- SQL Injection: Use prepared statements
- XSS (Cross-Site Scripting): Sanitize user input
- CSRF (Cross-Site Request Forgery): Use tokens
- Broken Authentication: Proper token validation
- Exposed Secrets: Never commit credentials

**Q: What's input validation?**
A: Checking if input meets requirements before processing
```
- Email format validation
- Phone number validation
- Price must be positive
- String length validation
```

### 8. Performance Concepts

**Q: What's caching?**
A: Storing frequently accessed data in fast storage (RAM)
- Reduces database calls
- Improves response time
- Challenges: Cache invalidation, memory usage

**Q: What's database indexing?**
A: Creating data structures to speed up queries
- Index on commonly searched fields
- Trade-off: Faster reads, slower writes

**Q: What's N+1 query problem?**
A: Loading main data + 1 query per item = N+1 queries (inefficient)
```
// Bad: N+1 queries
for room in rooms:
  ratings = getRatings(room.id)  // N queries

// Good: 1 query with joins
rooms = getRoomsWithRatings()
```

### 9. Data Validation

**Q: What are validation rules?**
A:
- Required fields: Must be present
- Type validation: Correct data type
- Format validation: Correct format (email, phone)
- Range validation: Within acceptable range
- Business logic validation: Matches business rules

**Q: How should validation errors be handled?**
A:
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "price",
      "message": "Price must be positive"
    }
  ]
}
```

### 10. Testing

**Q: What types of testing exist?**
A:
- Unit Testing: Test individual functions
- Integration Testing: Test multiple components
- End-to-End Testing: Test entire workflow
- Load Testing: Test performance under load

**Q: What should be tested?**
A:
- Happy path: Normal successful flow
- Error cases: Invalid input handling
- Edge cases: Boundary conditions
- Authorization: Access control

---

## AUTHENTICATION & AUTHORIZATION

### Authentication Flow in RUMI

1. **User Login** (via Supabase)
   - Frontend sends credentials to Supabase
   - Supabase returns JWT token

2. **Token in Requests**
   - Frontend includes token in Authorization header
   - Format: `Authorization: Bearer {token}`

3. **Server Validation**
   - Backend receives request with token
   - SupabaseAuthService validates token
   - Extracts user ID from token

4. **Authorization Check**
   - Verify user has required role/permissions
   - Example: Only admin can approve listings
   - Return 403 FORBIDDEN if unauthorized

### Required Authorization for Endpoints

**Admin Only:**
- All `/api/admin/*` endpoints

**Authenticated User:**
- POST /api/rooms (create own listing)
- GET /api/rooms/my-listings
- DELETE /api/rooms/{id} (own rooms only)
- POST /api/rooms/{id}/images
- POST /api/bookings
- POST /api/ratings
- POST /api/wishlists

**Public (No Auth Required):**
- GET /api/rooms/{id}
- GET /api/rooms/search
- GET /api/rooms/{id}/images
- GET /api/room-share-posts
- GET /api/ratings/room/{id}/*

### Sample Authorization Header

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## TESTING STRATEGIES

### 1. Manual Testing

#### Using curl

```bash
# Test GET request
curl -X GET http://localhost:8080/api/rooms/1

# Test POST with data
curl -X POST http://localhost:8080/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roomTitle": "Studio",
    "price": 50000,
    "city": "Tokyo",
    "country": "Japan"
  }'

# Test with query parameters
curl -X GET "http://localhost:8080/api/rooms/search?city=Tokyo&minPrice=30000&maxPrice=100000"

# Test DELETE
curl -X DELETE http://localhost:8080/api/rooms/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Using Postman

1. Create new request
2. Select HTTP method (GET, POST, etc.)
3. Enter URL
4. Add headers (Authorization, Content-Type)
5. Add body (for POST/PUT)
6. Click Send
7. Verify response

#### Using VS Code REST Client

Create `.http` file:
```http
### Get room details
GET http://localhost:8080/api/rooms/1

### Create room
POST http://localhost:8080/api/rooms
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "roomTitle": "Studio",
  "price": 50000,
  "city": "Tokyo",
  "country": "Japan"
}

### Search rooms
GET http://localhost:8080/api/rooms/search?city=Tokyo&minPrice=30000&maxPrice=100000

### Get user wishlists
GET http://localhost:8080/api/wishlists/user/user789
```

### 2. Test Checklist for Each Endpoint

For each endpoint, test:

- [ ] **Happy Path**: Normal successful request
- [ ] **Invalid Input**: Missing required fields
- [ ] **Wrong HTTP Method**: GET on POST endpoint
- [ ] **Wrong Path**: Typos in URL
- [ ] **Authorization**: Missing/invalid token
- [ ] **Permissions**: User without proper role
- [ ] **Not Found**: Resource doesn't exist
- [ ] **Edge Cases**: Boundary values

### 3. Sample Test Cases

#### Create Room Endpoint

```
Test 1: Valid request
- Input: All required fields
- Expected: 201 CREATED with roomId

Test 2: Missing title
- Input: No roomTitle
- Expected: 400 BAD REQUEST

Test 3: Invalid token
- Input: Expired/invalid token
- Expected: 401 UNAUTHORIZED

Test 4: Negative price
- Input: price = -1000
- Expected: 400 BAD REQUEST

Test 5: Very long title
- Input: roomTitle with 1000 characters
- Expected: 400 BAD REQUEST (validation)
```

### 4. Performance Testing

```bash
# Load testing with Apache Bench (test 1000 requests, 10 concurrent)
ab -n 1000 -c 10 http://localhost:8080/api/rooms/1

# Load testing with wrk
wrk -t4 -c100 -d30s http://localhost:8080/api/rooms/search?city=Tokyo
```

### 5. Integration Testing

Test multiple endpoints together:

```
Workflow 1: Full Booking Journey
1. User searches for rooms: GET /api/rooms/search
2. User views room: GET /api/rooms/{id}
3. User creates booking: POST /api/bookings
4. User views their bookings: GET /api/bookings/user/{userId}
5. User rates room: POST /api/ratings
6. User adds to wishlist: POST /api/wishlists
7. User views wishlists: GET /api/wishlists/user/{userId}
```

### 6. Error Scenario Testing

```
Scenario 1: Rate before booking
- Try to rate room without booking
- Expected: Validation error or success (depending on business logic)

Scenario 2: Double booking
- Create booking for same room twice
- Check if prevented or allowed

Scenario 3: Edit after deletion
- Delete room
- Try to upload images to deleted room
- Expected: 404 NOT FOUND

Scenario 4: Admin operations by regular user
- Regular user tries to approve listing
- Expected: 403 FORBIDDEN
```

### 7. Response Time Testing

Acceptable response times:
- Read operations: < 200ms
- Write operations: < 500ms
- Search operations: < 1s
- Admin operations: < 2s

### 8. Database Testing

```sql
-- Verify room created
SELECT * FROM room WHERE id = 1;

-- Verify relationships
SELECT r.*, b.* FROM room r 
LEFT JOIN booking b ON r.id = b.room_id;

-- Check ratings aggregation
SELECT room_id, AVG(stars), COUNT(*) 
FROM rating GROUP BY room_id;
```

---

## KEY TAKEAWAYS FOR VIVA

1. **39 Total Working Endpoints** across 6 main resource categories
2. **CRUD Operations**: Every endpoint performs one of Create/Read/Update/Delete
3. **Authentication**: Token-based using JWT via Authorization header
4. **REST Principles**: Resource-based URLs with standard HTTP methods
5. **Paginated Results**: Large datasets use page/size parameters
6. **Error Handling**: Proper HTTP status codes + error messages
7. **Security**: Role-based access control (admin vs user)
8. **Testing**: Manual + automated testing important
9. **Performance**: Consider caching, indexing, N+1 queries
10. **Validation**: Input validation at controller/service level

---

## COMMON VIVA QUESTIONS

1. **"How many endpoints does your backend have?"**
   - Answer: 39 working endpoints across 6 main resource categories

2. **"Explain the architecture of your backend"**
   - Answer: Spring Boot REST API with Supabase authentication, Entity-Service-Controller layers

3. **"How do you handle authentication?"**
   - Answer: Token-based JWT verification via Authorization header

4. **"Tell me about error handling"**
   - Answer: Return appropriate HTTP status codes with error messages in response body

5. **"What's the difference between the endpoints for creating and updating?"**
   - Answer: POST creates (201), PUT updates (200). Different operations with different semantics

6. **"How would you scale this backend?"**
   - Answer: Add caching (Redis), database optimization, microservices, load balancing

7. **"What are the security considerations?"**
   - Answer: Input validation, token validation, role-based access control, HTTPS, CORS

8. **"How do you test these endpoints?"**
   - Answer: Manual testing (curl/Postman), automated testing, load testing, integration testing

9. **"Explain pagination implementation"**
   - Answer: Use page/size parameters, return total count, allows handling large datasets efficiently

10. **"What happens if a room is deleted but has active bookings?"**
    - Answer: Depends on business logic - cascade delete or prevent deletion

---

### CRUD Interview Questions & Answers

**Q: What does CRUD stand for?**
A: Create, Read, Update, Delete - the four fundamental database operations for managing data.

**Q: What HTTP methods map to CRUD?**
A:
- CREATE → POST
- READ → GET
- UPDATE → PUT or PATCH
- DELETE → DELETE

**Q: What's the difference between PUT and PATCH?**
A:
- PUT: Replaces entire resource (full update). Idempotent. Needs all fields.
- PATCH: Partially modifies resource. Idempotent. Only changed fields needed.
- RUMI uses PUT for updates.

**Q: Can you call the same POST request twice and get the same result?**
A: No. POST is not idempotent. Calling it twice creates two resources. Each creates a new record with different ID.

**Q: Can you call GET twice and get the same result?**
A: Yes, always. GET is idempotent and safe. Multiple calls return identical data.

**Q: What's idempotency?**
A: Property where multiple identical requests have same effect as single request. GET, PUT, DELETE are idempotent. POST is not.

**Q: Which operations are safe in REST?**
A: Only GET. Safe means doesn't modify server state. POST, PUT, PATCH, DELETE modify state.

**Q: Why do we need CRUD?**
A:
- Standardized operations
- Covers all basic data needs
- Easy to understand
- Foundation for API design
- Applicable to all systems

**Q: What CRUD operations does RUMI support?**
A:
- CREATE: Rooms, Posts, Ratings, Bookings, Wishlists, Admin user
- READ: All resources
- UPDATE: Room share posts, Admin operations (approve/reject/ban)
- DELETE: Rooms, Posts, Wishlists

**Q: Why doesn't RUMI allow updating rooms?**
A: Business logic - room updates aren't required. Users delete and recreate instead. Prevents data corruption and versioning issues.

**Q: Why doesn't RUMI allow deleting ratings?**
A: Ratings are immutable. Keeps review history intact. Prevents manipulation of ratings. If user wants to change, delete old and create new.

**Q: What's the difference between soft delete and hard delete?**
A:
- Soft Delete: Mark as deleted (WHERE deleted=true), data still in DB
- Hard Delete: Actually remove from DB, can't recover
- RUMI likely uses soft deletes for auditing

**Q: Design CRUD for a Blog Post**
A:
- CREATE: POST /api/posts - Create new post
- READ: GET /api/posts, GET /api/posts/{id} - List all, get specific
- UPDATE: PUT /api/posts/{id} - Edit post
- DELETE: DELETE /api/posts/{id} - Remove post

**Q: How would you implement pagination in READ?**
A:
```
GET /api/posts?page=0&size=10&sort=created_at&order=desc
Response includes:
- content: Array of posts
- totalElements: Total count
- totalPages: Total pages
- currentPage: Current page number
```

**Q: What validation should happen in CREATE?**
A:
- Required fields present
- Correct data types
- Valid format (email, phone)
- Value ranges (negative price invalid)
- Business rules (user can only create max 10 listings)

**Q: What happens if UPDATE references non-existent resource?**
A:
- Option 1: Return 404 Not Found
- Option 2: Create the resource (upsert - update or insert)
- RUMI returns 404

**Q: How do you handle concurrent CRUD operations?**
A:
- Use transactions
- Locking (pessimistic/optimistic)
- Version numbers
- Timestamps
- Database constraints

**Q: What error codes for each CRUD operation?**
A:
- CREATE: 201 Created, 400 Bad Request, 409 Conflict (duplicate)
- READ: 200 OK, 404 Not Found
- UPDATE: 200 OK, 400 Bad Request, 404 Not Found
- DELETE: 200 OK, 204 No Content, 404 Not Found

---

---

## ENDPOINT QUICK REFERENCE

| Resource | CREATE | READ | UPDATE | DELETE |
|----------|--------|------|--------|--------|
| **Rooms** | POST /api/rooms | GET /api/rooms/{id} | ❌ | DELETE /api/rooms/{id} |
| **Room Share Posts** | POST | GET /filter | PUT /{id} | DELETE /{id} |
| **Ratings** | POST | GET /room/{id} | ❌ | ❌ |
| **Bookings** | POST | GET /user/{userId} | ❌ | ❌ |
| **Wishlists** | POST | GET /user/{userId} | ❌ | DELETE /{userId}/{roomId} |
| **Admin** | POST setup/* | GET /listings | PUT approve/reject | ❌ |

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-30  
**Backend Version:** Spring Boot with Supabase  

---
