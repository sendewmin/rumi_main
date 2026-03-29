# RUMI BACKEND - VIVA CHEAT SHEET

## 📊 QUICK STATS
- **Total Endpoints:** 39
- **Backend:** Spring Boot + Supabase
- **API Type:** REST
- **Auth:** JWT Token (Bearer)
- **Data Format:** JSON
- **CORS:** Enabled

---

## 🔌 API ENDPOINTS (39 Total)

### ROOMS (7)
| Method | Endpoint | CRUD | Auth | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/rooms` | C | ✅ | Create room |
| GET | `/api/rooms/{id}` | R | ❌ | Get room details |
| GET | `/api/rooms/my-listings` | R | ✅ | Get user's rooms |
| GET | `/api/rooms/search` | R | ❌ | Search/filter rooms |
| DELETE | `/api/rooms/{id}` | D | ✅ | Delete room |
| POST | `/api/rooms/{id}/images` | C | ✅ | Upload images |
| GET | `/api/rooms/{id}/images` | R | ❌ | Get images |

### ADMIN (11)
| Method | Endpoint | CRUD | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/listings/pending` | R | Get pending listings |
| PUT | `/api/admin/listings/{id}/approve` | U | Approve listing |
| PUT | `/api/admin/listings/{id}/reject` | U | Reject listing |
| GET | `/api/admin/listings` | R | Get all listings (filtered) |
| GET | `/api/admin/statistics` | R | Get approval stats |
| GET | `/api/admin/users` | R | Get all users |
| PUT | `/api/admin/users/{id}/ban` | U | Ban user |
| PUT | `/api/admin/users/{id}/unban` | U | Unban user |
| POST | `/api/admin/setup/create-admin-user` | C | Setup admin |
| POST | `/api/admin/setup/create-admin-direct` | C | Setup admin (direct) |
| GET | `/api/admin/rooms/verification-pending` | R | Get pending verification |

### ROOM SHARE POSTS (6)
| Method | Endpoint | CRUD | Purpose |
|--------|----------|------|---------|
| POST | `/api/room-share-posts` | C | Create post |
| GET | `/api/room-share-posts` | R | Get all posts |
| GET | `/api/room-share-posts/{id}` | R | Get post |
| GET | `/api/room-share-posts/filter` | R | Filter posts |
| PUT | `/api/room-share-posts/{id}` | U | Update post |
| DELETE | `/api/room-share-posts/{id}` | D | Delete post |

### RATINGS (5)
| Method | Endpoint | CRUD | Purpose |
|--------|----------|------|---------|
| POST | `/api/ratings` | C | Submit rating |
| GET | `/api/ratings/check/{userId}/{roomId}` | R | Check if rated |
| GET | `/api/ratings/room/{id}` | R | Get ratings |
| GET | `/api/ratings/room/{id}/stats` | R | Get rating stats |
| GET | `/api/ratings/room/{id}/reviews` | R | Get reviews |

### BOOKINGS (3)
| Method | Endpoint | CRUD | Purpose |
|--------|----------|------|---------|
| POST | `/api/bookings` | C | Create booking |
| GET | `/api/bookings/check/{userId}/{roomId}` | R | Check booking exists |
| GET | `/api/bookings/user/{userId}` | R | Get user bookings |

### WISHLISTS (4)
| Method | Endpoint | CRUD | Purpose |
|--------|----------|------|---------|
| POST | `/api/wishlists` | C | Add to wishlist |
| GET | `/api/wishlists/user/{userId}` | R | Get user wishlists |
| GET | `/api/wishlists/{userId}/{roomId}/exists` | R | Check in wishlist |
| DELETE | `/api/wishlists/{userId}/{roomId}` | D | Remove from wishlist |

---

## 📚 API TYPES

| Type | HTTP | Characteristics | RUMI? |
|------|------|-----------------|-------|
| **REST** | HTTP | Resource-based, JSON, simple | ✅ |
| **SOAP** | HTTP | XML, complex, enterprise | ❌ |
| **GraphQL** | HTTP | Query language, flexible | ❌ |
| **gRPC** | HTTP/2 | Protocol Buffers, fast | ❌ |
| **WebSocket** | TCP | Real-time, bidirectional | ❌ |

---

## 🔄 CRUD OPERATIONS

| Operation | HTTP | Status | Idempotent | Safe | Example |
|-----------|------|--------|-----------|------|---------|
| **CREATE** | POST | 201 | ❌ | ❌ | POST /api/rooms |
| **READ** | GET | 200 | ✅ | ✅ | GET /api/rooms/1 |
| **UPDATE** | PUT | 200 | ✅ | ❌ | PUT /api/room-share-posts/1 |
| **DELETE** | DELETE | 200 | ✅ | ❌ | DELETE /api/rooms/1 |

**Idempotent:** Multiple calls = single call effect  
**Safe:** Doesn't modify server state

---

## 🔐 AUTHENTICATION

**Type:** JWT Token (Bearer)  
**Format:** `Authorization: Bearer {token}`  
**Provider:** Supabase  
**Protected Endpoints:** POST, PUT, DELETE (most GET free)

### Who Needs Auth?
- ✅ Create/update own data (rooms, posts, ratings, bookings, wishlists)
- ✅ All admin endpoints
- ✅ Delete operations
- ❌ Public reads (search, view details, view reviews)

---

## 📋 REQUEST/RESPONSE BASICS

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Status Codes
- **200** OK - Success
- **201** Created - Resource created
- **204** No Content - Success, no body
- **400** Bad Request - Invalid data
- **401** Unauthorized - No/invalid token
- **403** Forbidden - No permission
- **404** Not Found - Resource missing
- **409** Conflict - Duplicate/conflict
- **500** Server Error

### Error Response
```json
{
  "error": "Description",
  "statusCode": 400
}
```

---

## ✔️ QUERY PARAMETERS

### Common
- `page=0` - Page number (0-indexed)
- `size=10` - Items per page
- `sort=price` - Sort by field
- `order=asc/desc` - Sort order

### Search Specific
- `city=Tokyo`
- `country=Japan`
- `minPrice=30000`
- `maxPrice=100000`
- `genderAllowed=ANY/MALE_ONLY/FEMALE_ONLY`
- `roomStatus=AVAILABLE/UNAVAILABLE`
- `roomType=STUDIO/ONE_BEDROOM/etc`

### Room Share Posts Filter
- `location=Tokyo`
- `genderPreference=ANY/MALE_ONLY/FEMALE_ONLY`
- `maxRent=50000`

---

## 🧪 TESTING QUICK COMMANDS

### GET Request
```bash
curl http://localhost:8080/api/rooms/1
```

### POST Request
```bash
curl -X POST http://localhost:8080/api/rooms \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roomTitle":"Studio","price":50000,"city":"Tokyo"}'
```

### DELETE Request
```bash
curl -X DELETE http://localhost:8080/api/rooms/1 \
  -H "Authorization: Bearer TOKEN"
```

### Search Request
```bash
curl "http://localhost:8080/api/rooms/search?city=Tokyo&minPrice=30000&page=0&size=10"
```

---

## 🏗️ ARCHITECTURE

```
Controller Layer (Receive Requests)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Database)
    ↓
Entity/Model (Data Objects)
```

### Layer Responsibilities
- **Controller:** Route requests, validation, response formatting
- **Service:** Business logic, authentication, authorization
- **Repository:** Database queries (JPA/ORM)
- **Entity:** Database table mapping

---

## 🛡️ SECURITY CHECKLIST

- ✅ Input validation
- ✅ Token verification
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ SQL injection prevention (JPA)
- ✅ XSS prevention (JSON responses)
- ✅ Password hashing (Supabase)
- ✅ HTTPS recommended

---

## 🔑 KEY CONCEPTS

### Pagination
Returns `page`, `size`, `totalElements`, `totalPages`, `content` array

### Filtering
Multiple params combined with AND logic

### Soft Delete
Mark as deleted, don't actually remove (audit trail)

### Idempotency
GET/PUT/DELETE safe to call multiple times  
POST creates new every time

### Resource-Based URLs
✅ `/api/rooms` (noun)  
❌ `/api/getRooms` (verb)

### Stateless
Each request independent, no session storage on server

---

## 💡 COMMON INTERVIEW ANSWERS

**Q: API type?**  
A: REST API - resource-based, JSON, uses HTTP methods

**Q: Auth method?**  
A: JWT tokens in Authorization header via Supabase

**Q: How many endpoints?**  
A: 39 across 6 resources (Rooms, Admin, Posts, Ratings, Bookings, Wishlists)

**Q: Difference POST vs PUT?**  
A: POST creates (201, not idempotent), PUT updates (200, idempotent)

**Q: How to handle large datasets?**  
A: Pagination with page/size parameters

**Q: Error handling?**  
A: Return proper HTTP codes + error message in body

**Q: Why no UPDATE for rooms?**  
A: Business logic - users delete and recreate instead

**Q: Why no DELETE for ratings?**  
A: Immutable - keeps review history intact

**Q: Soft vs Hard delete?**  
A: Soft = mark deleted, Hard = actually remove

**Q: What's idempotent?**  
A: Multiple calls = single call effect (GET, PUT, DELETE)

**Q: RESTful principles?**  
A: Client-server, stateless, uniform interface, cacheable

---

## 📊 CRUD per Resource

| Resource | C | R | U | D |
|----------|---|---|---|---|
| **Rooms** | ✅ | ✅ | ❌ | ✅ |
| **Room Posts** | ✅ | ✅ | ✅ | ✅ |
| **Ratings** | ✅ | ✅ | ❌ | ❌ |
| **Bookings** | ✅ | ✅ | ❌ | ❌ |
| **Wishlists** | ✅ | ✅ | ❌ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ❌ |

---

## 🎯 ENDPOINTS BY CRUD

**CREATE (7)**
- POST /api/rooms
- POST /api/room-share-posts
- POST /api/ratings
- POST /api/bookings
- POST /api/wishlists
- POST /api/rooms/{id}/images
- POST /api/admin/setup/*

**READ (20)**
- GET /api/rooms/{id}
- GET /api/rooms/search
- GET /api/rooms/my-listings
- GET /api/rooms/{id}/images
- GET /api/room-share-posts
- GET /api/room-share-posts/{id}
- GET /api/room-share-posts/filter
- GET /api/ratings/check/*
- GET /api/ratings/room/*
- GET /api/bookings/check/*
- GET /api/bookings/user/*
- GET /api/wishlists/user/*
- GET /api/wishlists/*/exists
- GET /api/admin/listings
- GET /api/admin/listings/pending
- GET /api/admin/users
- GET /api/admin/statistics
- GET /api/admin/rooms/verification-pending

**UPDATE (8)**
- PUT /api/room-share-posts/{id}
- PUT /api/admin/listings/{id}/approve
- PUT /api/admin/listings/{id}/reject
- PUT /api/admin/users/{id}/ban
- PUT /api/admin/users/{id}/unban

**DELETE (4)**
- DELETE /api/rooms/{id}
- DELETE /api/room-share-posts/{id}
- DELETE /api/wishlists/{userId}/{roomId}

---

## 🔍 RESPONSE FORMATS

### Paginated Response
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "size": 10
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

### Success Single Item
```json
{
  "roomId": 1,
  "roomTitle": "Studio",
  ...
}
```

### Success Array
```json
[
  { "id": 1, ... },
  { "id": 2, ... }
]
```

---

## ⚡ QUICK FACTS

- **Framework:** Spring Boot 3.x
- **Language:** Java
- **Database:** PostgreSQL via Supabase
- **Storage:** Supabase Storage (images)
- **Port:** 8080
- **Base URL:** `http://localhost:8080/api/`
- **CORS:** All origins allowed
- **Response Time Goal:** <500ms for writes, <200ms for reads
- **Pagination Default:** page=0, size=10

---

**Document:** Viva Cheat Sheet  
**Version:** 1.0  
**Created:** 2024-03-30  

*Print this out or save to phone for quick reference during viva!*
