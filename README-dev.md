# 🏠 Rumi Room Rental — Developer Guide

## 1️⃣ Prerequisites

| Tool | Version |
|---|---|
| Java | 17+ |
| Maven | via `mvnw` wrapper (no install needed) |
| MySQL | 8+ (MySQL Server + Workbench, or XAMPP) |
| IDE | IntelliJ IDEA (recommended) |
| Firebase | Service account JSON from project owner |

---

## 2️⃣ One-Time Setup

### Step 1 — Get Firebase access & JSON
1. Ask the project owner to add your email to the Firebase project
2. Open [Firebase Console](https://console.firebase.google.com) → Project Settings → Service Accounts → **Generate new private key**
3. Save the JSON to a folder **outside the repo** (e.g. `C:\Users\you\Documents\firebase\rumi-firebase.json`)

### Step 2 — Create the MySQL database
Open MySQL Workbench (or phpMyAdmin) and run:
```sql
CREATE DATABASE rumi_rental_db;
```
> ⚠️ Use exactly this name — it's hard-coded in the datasource config.

### Step 3 — Set environment variables
Open **Command Prompt** (not PowerShell) and run:
```bat
setx DB_URL            "jdbc:mysql://localhost:3306"
setx DB_USERNAME       "root"
setx DB_PASSWORD       "your_password_here"
setx FIREBASE_CREDENTIALS "C:\Users\you\Documents\firebase\rumi-firebase.json"
```
> ⚠️ **Restart your IDE** after setting environment variables.

---

## 3️⃣ Running the App

```bash
# From the rumi_backend_v2 folder:
.\mvnw.cmd spring-boot:run
```

Flyway automatically creates all tables on first run:
```
roles → users → rentee_profiles → renter_profiles → flyway_schema_history
```

---

## 4️⃣ Verify It's Working

Open a browser or Postman and hit these endpoints:

| # | URL | Expected Response |
|---|---|---|
| 1 | `GET /test/mysql/tables` | `MySQL Connected ✅ \| Tables: roles, users, ...` |
| 2 | `GET /test/mysql/database` | `MySQL Connected ✅ \| rumi_rental_db` |
| 3 | `GET /test/firebase` | `Firebase Connected ✅ \| App name: [DEFAULT]` |
| 4 | `GET /hello` | `hello world` |

---

## 5️⃣ Project Structure

```
src/main/java/com/rumi/rumi_backend_v2/
│
├── model/                        ← JPA Entities (map to DB tables)
│   ├── Role.java                 ← roles table
│   ├── User.java                 ← users table (Firebase UID as PK)
│   ├── RenteeProfile.java        ← rentee_profiles table
│   └── RenterProfile.java        ← renter_profiles table
│
├── repository/                   ← Spring Data JPA (DB queries)
│   ├── RoleRepository.java
│   ├── UserRepository.java
│   ├── RenteeProfileRepository.java
│   └── RenterProfileRepository.java
│
├── dto/                          ← Data Transfer Objects (API in/out)
│   ├── UserRegistrationRequest.java   ← request body for registration
│   └── UserResponse.java              ← response sent to frontend
│
├── service/                      ← Business logic
│   └── UserService.java          ← register, fetch user(s)
│
├── controller/                   ← REST API endpoints
│   ├── UserController.java       ← /api/users
│   └── HelloController.java      ← /hello (sanity check)
│
├── firebase/
│   └── FirebaseConfig.java       ← Firebase Admin SDK init
│
└── test_db_setup/
    └── TestController.java       ← /test/* connection checks
│
resources/
├── application.properties        ← App config (reads env vars)
└── db/migration/                 ← Flyway SQL scripts
    ├── V1__create_roles_table.sql
    ├── V2__seed_roles.sql
    ├── V3__create_users_table.sql
    ├── V4__create_rentee_profile.sql
    └── V5__create_renter_profile.sql
```

---

## 6️⃣ API Endpoints

### User Registration & Retrieval — `/api/users`

#### `POST /api/users/register`
Call this **after** Firebase Auth succeeds on the frontend.

**Request body:**
```json
{
  "firebaseUid": "abc123xyz",
  "fullName":    "Jane Doe",
  "email":       "jane@example.com",
  "phone":       "+60123456789",
  "role":        "rentee"
}
```
> `role` must be `"rentee"` or `"renter"`

**Success response (201 Created):**
```json
{
  "userId": "abc123xyz",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+60123456789",
  "role": "rentee",
  "status": "active",
  "profileCompleted": false,
  "phoneVerified": false,
  "createdAt": "2026-02-24T12:00:00"
}
```

---

#### `GET /api/users/{firebaseUid}`
Fetch a user profile by Firebase UID.
```
GET /api/users/abc123xyz
→ 200 OK  { ...UserResponse... }
→ 404 Not Found  "User not found: abc123xyz"
```

---

#### `GET /api/users`
Fetch all users (for admin dashboard).
```
GET /api/users
→ 200 OK  [ { ...UserResponse... }, ... ]
```

---

## 7️⃣ How to Add a New Feature (Developer Workflow)

### Adding a new table
1. Create a new Flyway migration file in `resources/db/migration/`:
   ```
   V6__add_room_listing.sql
   ```
   ```sql
   CREATE TABLE IF NOT EXISTS room_listings (
       listing_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
       user_id      VARCHAR(128) NOT NULL,
       title        VARCHAR(255) NOT NULL,
       price        DECIMAL(10,2) NOT NULL,
       created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(user_id)
   );
   ```
   > ⚠️ **Never edit an existing Vn__ file** — Flyway tracks checksums. Always create a new version.

2. Create the JPA entity in `model/RoomListing.java`
3. Create the repository in `repository/RoomListingRepository.java`
4. Add service logic in `service/RoomListingService.java`
5. Expose endpoints in `controller/RoomListingController.java`
6. Restart the app — Flyway auto-runs the new migration ✅

---

## 8️⃣ How Firebase + MySQL Work Together

```
Frontend (Flutter / React)
        │
        │  1. User signs up → Firebase Auth
        ▼
   Firebase Auth ─────────────────────────────────────
        │                                              │
        │  Returns: firebaseUid, email, token          │ Stores auth credentials
        │                                              │ (password, phone, Google)
        │  2. Frontend calls our backend
        ▼
   Spring Boot Backend
        │
        │  POST /api/users/register
        │  { firebaseUid, fullName, email, phone, role }
        │
        │  Saves user metadata in MySQL
        ▼
   MySQL — rumi_rental_db
   (users, roles, rentee_profiles, renter_profiles)
```

- **Firebase** = holds authentication (who you are)
- **MySQL** = holds application data (your profile, listings, bookings)
- The `firebaseUid` links the two systems together as the shared primary key

---

## 9️⃣ Best Practices

- ✅ Always use environment variables — never hardcode credentials
- ✅ Never commit `firebase-service.json` (excluded in `.gitignore`)
- ✅ Add new tables via Flyway migrations — never by editing existing V__ files
- ✅ Always go through `Service` → `Repository` — never call the repository directly from a controller
- ✅ Use DTOs (Request/Response) — never return JPA entities directly to the frontend