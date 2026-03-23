# Supabase Room Data Setup Guide

## Quick Troubleshooting

If you see "Room not found in database" error, follow these steps:

### Step 1: Open Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. You'll see: `💡 Supabase tools available! Type: window.supabase_diagnostics.help()`

### Step 2: Run Diagnostics
Type in the console:
```javascript
window.supabase_diagnostics.runDiagnostics()
```

This will show:
- ✓ Environment variables
- ✓ Database connection status
- ✓ Rooms table structure
- ✓ Room count
- ✓ Available room IDs

### Step 3: If No Rooms Found

**Option A: Reseed Everything** (Recommended)
```javascript
window.supabase_diagnostics.clearAndReseedRooms()
```
This will:
- Clear existing rooms
- Insert 3 sample rooms (IDs: 1, 2, 3)
- Ready to test!

**Option B: Insert Single Test Room**
```javascript
window.supabase_diagnostics.insertTestRoom()
```
This adds room ID #1

### Step 4: Test the Listing
After reseeding, go to:
- http://localhost:3000/listing/1
- http://localhost:3000/listing/2
- http://localhost:3000/listing/3

You should see the room details load from Supabase!

---

## Environment Variables (.env file)

Make sure your `.env` file has:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: [Supabase Dashboard](https://app.supabase.com)
- Project Settings → API

---

## Supabase Table Schema

The system expects:

### `rooms` table
- `roomId` (bigint) - Primary key or unique identifier
- `roomTitle` (text)
- `roomDescription` (text)
- `roomStatus` (text) - e.g., 'AVAILABLE', 'BOOKED'
- `amount` (numeric) - Price
- `maxRoommates` (bigint)
- `bedrooms` (bigint)
- `bathrooms` (bigint)
- `totalRoomArea` (numeric)
- `roomType` (text) - e.g., 'Apartment', 'Suite', 'Studio'
- `addressLine` (text)
- `city` (text)
- `country` (text)
- `amenities` (jsonb or text)
- `avgRating` (numeric)
- `totalReviews` (bigint)

### `bookings` table
- `id` (uuid)
- `user_id` (uuid) - Foreign key to users
- `room_id` (bigint) - Foreign key to rooms
- `status` (text)
- `created_at` (timestamp)

### `ratings` table
- `id` (uuid)
- `user_id` (uuid)
- `room_id` (bigint)
- `stars` (numeric)
- `tags` (text array or jsonb)
- `comment` (text)
- `created_at` (timestamp)

---

## Console Helper Commands

Once the app is running, these are available in browser console:

```javascript
// Check everything
window.supabase_diagnostics.runDiagnostics()

// Add a test room
window.supabase_diagnostics.insertTestRoom()

// Clear and reseed all rooms
window.supabase_diagnostics.clearAndReseedRooms()

// Show this help menu
window.supabase_diagnostics.help()
```

---

## Common Issues

### "Room not found in database"
→ Run: `window.supabase_diagnostics.clearAndReseedRooms()`

### "REACT_APP_SUPABASE_URL: ❌ Missing"
→ Check `.env` file in `my-app` folder

### "Connection error: Invalid API key"
→ Verify anon key is correct in Supabase dashboard

### No images showing
→ Upload images to Supabase Storage at `RoomImages/{roomId}/`

---

## File Locations

- **Diagnostics**: `src/api/supabaseDiagnostics.js`
- **Seeding**: `src/api/seedRooms.js`
- **Supabase Client**: `src/api/supabaseClient.js`
- **ListingPage**: `src/components/ListingPage.js`
