# API Migration - Quick Start Guide

## 🎯 Current Status
Your app APIs are **partially set up**. The frontend is ready to use APIs, but the backend needs the database layer implemented.

## ⚡ What Was Done For You

### ✅ Frontend Changes
- All wishlist, booking, rating, and room share post operations now use `/api/*` endpoints
- The `rumi_client.js` axios client automatically routes all calls to the backend

### ✅ Backend Scaffolding
- 4 new REST controllers created with all required endpoints
- Each endpoint has TODO comments showing where to add database logic

---

## 🔴 What You Need To Do (Required)

### Step 1: Create JPA Entities
Create files in `rumi_backend_v2/src/main/java/com/rumi/rumi_backend_v2/entity/`:

**Wishlist.java**
```java
@Entity
@Table(name = "wishlists")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "room_id")
    private Long roomId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // getters/setters
}
```

**Booking.java**
```java
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "room_id")
    private Long roomId;
    
    @Column(name = "status")
    private String status; // "confirmed", "pending", etc.
    
    // ... other fields
}
```

**Rating.java**
```java
@Entity
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "room_id")
    private Long roomId;
    
    @Column(name = "stars")
    private Integer stars;
    
    @Column(name = "comment")
    private String comment;
    
    @Column(name = "tags")
    private String tags; // JSON
    
    // ... other fields
}
```

**RoomSharePost.java**
```java
@Entity
@Table(name = "room_share_posts")
public class RoomSharePost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "rent_per_person")
    private Integer rentPerPerson;
    
    @Column(name = "gender_preference")
    private String genderPreference;
    
    // ... other fields
}
```

### Step 2: Create JPA Repositories
Create files under `repository/` folder:

```java
package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByUserIdAndRoomId(String userId, Long roomId);
    List<Wishlist> findByUserId(String userId);
}
```

Do the same for: BookingRepository, RatingRepository, RoomSharePostRepository

### Step 3: Create Service Classes
Create files under `service/` folder:

```java
package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.Wishlist;
import com.rumi.rumi_backend_v2.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;
    
    public Wishlist addToWishlist(String userId, Long roomId) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setRoomId(roomId);
        wishlist.setCreatedAt(LocalDateTime.now());
        return wishlistRepository.save(wishlist);
    }
    
    public void removeFromWishlist(String userId, Long roomId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndRoomId(userId, roomId);
        if (wishlist != null) {
            wishlistRepository.delete(wishlist);
        }
    }
    
    public boolean isInWishlist(String userId, Long roomId) {
        return wishlistRepository.findByUserIdAndRoomId(userId, roomId) != null;
    }
    
    public List<Wishlist> getUserWishlists(String userId) {
        return wishlistRepository.findByUserId(userId);
    }
}
```

### Step 4: Update Controllers
Replace TODO comments in controllers with service calls:

**Current (in WishlistController.java line 30):**
```java
// TODO: Implement database call to insert into wishlists table
```

**Should be:**
```java
@Autowired
private WishlistService wishlistService;

@PostMapping
public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Object> request) {
    String userId = (String) request.get("user_id");
    Long roomId = ((Number) request.get("room_id")).longValue();
    
    Wishlist wishlist = wishlistService.addToWishlist(userId, roomId);
    return ResponseEntity.status(HttpStatus.CREATED).body(wishlist);
}
```

---

## 📝 Checklist To Complete

- [ ] Create 4 Entity classes (Wishlist, Booking, Rating, RoomSharePost)
- [ ] Create 4 Repository interfaces
- [ ] Create 4 Service classes with business logic
- [ ] Update WishlistController - replace all TODOs with service calls
- [ ] Update BookingController - replace all TODOs with service calls
- [ ] Update RatingController - replace all TODOs with service calls
- [ ] Update RoomSharePostController - replace all TODOs with service calls
- [ ] Build backend: `mvnw.cmd clean install -DskipTests`
- [ ] Run backend: `java -jar target/rumi_backend_v2-0.0.1-SNAPSHOT.jar`
- [ ] Test APIs with curl commands
- [ ] Run frontend: `npm start`
- [ ] Test frontend against backend

---

## 🧪 Test After Implementation

### Backend Test
```bash
# Start backend first
cd rumi_backend_v2
java -jar target/rumi_backend_v2-0.0.1-SNAPSHOT.jar

# In another terminal, test the API
curl -X POST http://localhost:8080/api/wishlists \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user-123","room_id":1}'

# Should return 201 with wishlist data
```

### Frontend Test
```bash
cd my-app
npm start

# Visit http://localhost:3000
# Open DevTools Network tab
# Try adding a room to wishlist
# You should see POST request to /api/wishlists
# Response should show the wishlist was added
```

---

## ❓ FAQ

**Q: Do I need to change the .env file?**
A: No, your current .env is fine. Supabase credentials are for authentication only.

**Q: Should I keep using supabaseClient for everything?**
A: No - only for authentication. Data operations now use `/api` endpoints.

**Q: What if I need to add fields to wishlists?**
A: Add them to the Wishlist entity, update the service logic, and update the API endpoint.

**Q: Can I test before implementing all endpoints?**
A: Yes! Test each one as you complete it. No need to wait.

---

## 📞 Need Help?

1. **Detailed guide**: `API_MIGRATION_GUIDE.md`
2. **Summary**: `API_MIGRATION_SUMMARY.md`  
3. **Example code**: Look at `RoomController.java` and `RoomService.java`

---

## 🚀 You're Almost There!

The hard part (setting up API structure) is done. Now you just need to:
1. Create the database entities
2. Wire up the database calls
3. Test everything

**Estimated time:** 2-3 hours for a developer familiar with Spring Boot & JPA

Good luck! 🎉
