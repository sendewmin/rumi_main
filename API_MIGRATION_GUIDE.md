# API Migration Setup Documentation

## Overview
The Rumi application has been refactored to use backend APIs instead of direct Supabase connections for data operations. This improves security, maintainability, and allows for centralized business logic.

## What Has Been Completed

### Frontend API Wrappers (Created/Updated)
1. **wishlistService.js** - Now uses `/api/wishlists` endpoints
2. **roomSharePostApi.js** - Now uses `/api/room-share-posts` endpoints  
3. **bookingService.js** - Now uses `/api/bookings` endpoints
4. **ratingService.js** - Now uses `/api/ratings` endpoints

### Backend Controllers (Created)
1. **WishlistController.java** (`/api/wishlists`)
   - POST `/api/wishlists` - Add room to wishlist
   - DELETE `/api/wishlists/{userId}/{roomId}` - Remove from wishlist
   - GET `/api/wishlists/{userId}/{roomId}/exists` - Check if in wishlist
   - GET `/api/wishlists/user/{userId}` - Get user's wishlist

2. **BookingController.java** (`/api/bookings`)
   - POST `/api/bookings` - Create booking
   - GET `/api/bookings/check/{userId}/{roomId}` - Check existing booking
   - GET `/api/bookings/user/{userId}` - Get user's bookings

3. **RatingController.java** (`/api/ratings`)
   - POST `/api/ratings` - Submit rating
   - GET `/api/ratings/check/{userId}/{roomId}` - Check if user has rated
   - GET `/api/ratings/room/{roomId}` - Get room ratings
   - GET `/api/ratings/room/{roomId}/stats` - Get rating statistics
   - GET `/api/ratings/room/{roomId}/reviews` - Get room reviews

4. **RoomSharePostController.java** (`/api/room-share-posts`)
   - GET `/api/room-share-posts` - Get all posts
   - POST `/api/room-share-posts` - Create post
   - GET `/api/room-share-posts/filter` - Filter posts
   - GET `/api/room-share-posts/{postId}` - Get specific post
   - PUT `/api/room-share-posts/{postId}` - Update post
   - DELETE `/api/room-share-posts/{postId}` - Delete post

## Existing Backend Controllers (Already Available)
- **RoomFilterController.java** (`/api/rooms/search`) - Room search and filtering
- **RoomImageController.java** (`/api/rooms/{roomId}/images`) - Image upload/retrieval
- **RoomController.java** (`/api/rooms`) - Room CRUD operations

## Frontend Configuration

### Environment Variables
The frontend uses the following environment variable:
- `REACT_APP_SUPABASE_URL` - Supabase URL (kept for authentication only)
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase anon key (kept for authentication only)

**API requests are automatically routed to `/api` baseURL via axios interceptor in `rumi_client.js`**

### API Client
All API calls use `axiosClient` from `src/api/rumi_client.js` which:
- Automatically sets baseURL to `/api`
- Handles JSON content-type headers
- Preserves Authorization headers

## Authentication & Supabase Integration
**Note:** Authentication remain direct Supabase connections:
- `src/auth/supabaseClient.js` - Auth configuration
- `src/auth/AuthContext.js` - Auth context provider
- Auth-related components (LoginPage, SignupPages, VerifyEmail) still use direct Supabase

This is intentional and correct as Supabase handles authentication natively.

## What Still Needs Implementation

### Backend Database Integration (TODO)
Each controller has placeholder TODO comments for database operations. You need to:

1. **Implement Repositories/Services** for:
   - Wishlist operations
   - Booking operations
   - Rating operations
   - Room share posts

2. **Database Entities** needed:
   - Wishlist entity (if not already exists)
   - Booking entity (if not already exists)
   - Rating entity (if not already exists)
   - RoomSharePost entity (if not already exists)

3. **Example implementation pattern** (in WishlistController.java):
   ```java
   @Autowired
   private WishlistRepository wishlistRepository;
   
   @PostMapping
   public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Object> request) {
       // Replace: // TODO: Implement database call...
       Wishlist wishlist = new Wishlist();
       wishlist.setUserId(userId);
       wishlist.setRoomId(roomId);
       Wishlist saved = wishlistRepository.save(wishlist);
       return ResponseEntity.status(HttpStatus.CREATED).body(saved);
   }
   ```

### Frontend Components Updates (Recommended but Check First)
Components currently importing supabaseClient directly:
- `BrowseRooms.js` - Check if using `roomFilterApi` (should already work)
- `LandlordDashboard.js` - Check if making data calls (should move to APIs)
- `ListingPage.js` - Already imports bookingService (should work)
- `seedRooms.js` - Only used for testing, can stay as is or migrate

**Authentication components can keep direct Supabase:**
- `LoginPage.js`
- `TenantSignup.js`
- `LandlordSignup.js`
- `VerifyEmail.js`
- `Homepage.js`

## Setup Steps

### 1. Backend Setup (If not already done)
```bash
cd rumi_backend_v2

# Set environment variables in env.properties
# DB_URL, DB_USERNAME, DB_PASSWORD should be configured

# Build the backend
mvnw.cmd clean install -DskipTests

# Run the backend (will listen on http://localhost:8080/api)
java -jar target/rumi_backend_v2-0.0.1-SNAPSHOT.jar
```

### 2. Frontend Setup
```bash
cd my-app

# Ensure .env has proper Supabase config (for auth only)
# REACT_APP_SUPABASE_URL=...
# REACT_APP_SUPABASE_ANON_KEY=...

# Install dependencies
npm install

# Start development server (will proxy /api calls to backend)
npm start
```

### 3. Proxy Configuration (Frontend)
The frontend package.json should have a proxy setting to forward API calls to the backend:
```json
{
  "proxy": "http://localhost:8080"
}
```
or use environment variable:
```
REACT_APP_API_URL=http://localhost:8080
```

## Testing the Setup

### Test API Connectivity
```bash
# Test room search API (existing)
curl http://localhost:8080/api/rooms/search?page=0&size=10

# Test wishlist API (new)
curl -X POST http://localhost:8080/api/wishlists \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","room_id":1}'

# Test booking API (new)
curl http://localhost:8080/api/bookings/check/test-user/1
```

### Test Frontend Integration
1. Open browser to http://localhost:3000
2. Check browser Network tab to verify:
   - API calls go to `/api` endpoints
   - Responses are received correctly
   - No direct Supabase data calls (except auth)

## Missing/Additional Configuration

### Environment Variables to Add
For production deployment, ensure these are set:
- Backend environment variables in `env.properties`
- Frontend environment variables in `.env`
- CORS settings in backend (already set to `*` in controllers)

### Dependencies Already Available
- Frontend: axios (configured in rumi_client.js)
- Backend: Spring Boot, Spring Data JPA, Spring Web

### Optional Enhancements
1. Add request/response interceptors for better error handling
2. Add request retry logic for failed API calls
3. Add loading states and error boundaries in React components
4. Implement proper error responses from backend
5. Add API documentation (Swagger/OpenAPI)

## Common Issues & Solutions

### Issue: "Failed to fetch" errors
- Check if backend is running on port 8080
- Verify proxy configuration in frontend
- Check CORS settings (currently open to all origins)

### Issue: 404 errors on API endpoints
- Ensure backend is deployed with the new controllers
- Check URL paths match exactly (case-sensitive)
- Verify Spring Boot is recognizing the new controller classes

### Issue: Authentication failures
- Keep using supabaseClient.js from auth folder (not the API wrapper)
- Ensure Supabase credentials are correct in .env
- Check that Supabase project is active and accessible

## Next Steps

1. **Implement Database Layer** in backend controllers
2. **Test all endpoints** with sample data
3. **Update component integration tests** to work with API instead of direct Supabase
4. **Add error handling** and retry logic
5. **Document API specifications** (OpenAPI/Swagger)
6. **Deploy to production** with proper environment configuration

## Files Modified
- `my-app/src/api/wishlistService.js` - ✅ Updated to use API
- `my-app/src/api/roomSharePostApi.js` - ✅ Updated to use API
- `my-app/src/components/rating_system/services/bookingService.js` - ✅ Updated to use API
- `my-app/src/components/rating_system/services/ratingService.js` - ✅ Updated to use API

## Files Created
- `rumi_backend_v2/src/main/java/com/rumi/rumi_backend_v2/controller/WishlistController.java`
- `rumi_backend_v2/src/main/java/com/rumi/rumi_backend_v2/controller/BookingController.java`
- `rumi_backend_v2/src/main/java/com/rumi/rumi_backend_v2/controller/RatingController.java`
- `rumi_backend_v2/src/main/java/com/rumi/rumi_backend_v2/controller/RoomSharePostController.java`

## Support & Questions
For questions on implementation, refer to existing controllers like `RoomController.java` for the pattern used in this project.
