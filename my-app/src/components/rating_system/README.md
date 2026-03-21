# RUMI Rating System - Implementation Guide

## Overview

The rating system has been redesigned with an **Uber-inspired UI/UX** featuring:

- ⭐ Interactive 5-star rating with smooth animations
- 🏷️ Preset context tags (e.g., "Excellent", "Clean", "Comfortable")
- 💬 Optional feedback comment box
- 📊 Rating distribution display
- 🎨 Modern card-based design with spring easing animations
- 📱 Fully responsive mobile experience

---

## 📁 Component Structure

```
rating_system/
├── component/
│   ├── rateRoom.jsx               # Main rating submission component
│   ├── rateRoom.css               # Uber-inspired styling
│   ├── ratingDisplay.jsx          # Ratings statistics display
│   ├── ratingDisplay.css          # Display component styling
│   └── ratingStars.jsx            # (Existing) Star component
├── services/
│   └── ratingService.js           # Supabase API integration
├── utils/
│   └── checkBooking.js            # Booking eligibility check
├── supabaseClient.js              # Supabase client config
└── README.md                       # This file
```

---

## 🎨 Features & Design System

### Rating Component Features

1. **Interactive Star Selection**
   - Smooth hover effects with scale animation
   - Visual feedback on selection
   - Dynamic label updates

2. **Context Tags**
   - 5 preset tags per rating level (1-5 stars)
   - Each tag is context-aware (changes based on rating)
   - Multi-select capability
   - Visual selection feedback

3. **Feedback Section**
   - Optional 500-character comment field
   - Character counter
   - Focus animations

4. **Data Validation**
   - Ensures user has booked room before rating
   - Prevents empty submissions
   - Real-time feedback messages

### Display Component Features

1. **Average Rating Display**
   - Large, prominent score number
   - Mini star visualization
   - Total review count

2. **Distribution Breakdown**
   - Horizontal bar chart for each star level
   - Count indicators
   - Animated bar fills
   - Responsive grid layout

---

## 🗄️ Database Schema

### Main Table: `ratings`

```sql
CREATE TABLE ratings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id BIGINT NOT NULL REFERENCES room_detail(room_id) ON DELETE CASCADE,
  stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  tags JSONB,                          -- Array of selected preset tags
  comment TEXT,                        -- Optional feedback comment
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, room_id)             -- One rating per user per room
);

-- Indexes for performance
CREATE INDEX idx_ratings_room_id ON ratings(room_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_created_at ON ratings(created_at DESC);
```

### Reference Table: `rating_tags` (Optional)

```sql
CREATE TABLE rating_tags (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  rating_level INT NOT NULL CHECK (rating_level >= 1 AND rating_level <= 5),
  tag_name VARCHAR(50) NOT NULL,
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO rating_tags (rating_level, tag_name, display_order) VALUES
  (1, 'Poor', 1), (1, 'Not recommend', 2), (1, 'Uncomfortable', 3), (1, 'Dirty', 4),
  (2, 'Below average', 1), (2, 'Needs improvement', 2), (2, 'Disappointing', 3), (2, 'Issues', 4),
  (3, 'Acceptable', 1), (3, 'Decent', 2), (3, 'Okay', 3), (3, 'Average', 4),
  (4, 'Good', 1), (4, 'Comfortable', 2), (4, 'Recommended', 3), (4, 'Nice', 4),
  (5, 'Excellent', 1), (5, 'Amazing', 2), (5, 'Perfect', 3), (5, 'Highly recommend', 4);
```

### Data Structure Examples

**Tags Storage (JSON Array in `tags` field):**
```json
["Excellent", "Clean", "Comfortable"]
```

**Rating Row:**
```json
{
  "id": 123,
  "user_id": 45,
  "room_id": 89,
  "stars": 5,
  "tags": ["Excellent", "Clean", "Comfortable"],
  "comment": "Amazing room with excellent utilities and friendly landlord!",
  "created_at": "2026-03-21T10:30:00Z",
  "updated_at": "2026-03-21T10:30:00Z"
}
```

---

## 🚀 Usage

### Displaying the Rating Form

```jsx
import RateRoom from "./components/rating_system/component/rateRoom"

// In your component
<RateRoom roomId={123} userId={456} />
```

### Displaying Rating Statistics

```jsx
import RatingDisplay from "./components/rating_system/component/ratingDisplay"

// In your component
<RatingDisplay roomId={123} />
```

---

## 🔌 API Functions

### `submitRating(userId, roomId, stars, tags, comment)`

Submits a rating with optional tags and comment.

**Parameters:**
- `userId` (number): User identifier
- `roomId` (number): Room identifier
- `stars` (number): Rating 1-5
- `tags` (string[]): Selected preset tags (optional)
- `comment` (string): Feedback text (optional)

**Returns:** Rating object or null on error

**Example:**
```javascript
const result = await submitRating(
  456, 
  123, 
  5, 
  ["Excellent", "Clean"], 
  "Great room!"
)
```

### `getRoomRatings(roomId)`

Fetches all ratings for a room.

**Returns:** Array of rating objects or null

### `getRoomRatingStats(roomId)`

Gets aggregated statistics for a room.

**Returns:**
```javascript
{
  average: "4.5",
  total: 24,
  distribution: {
    1: 2,
    2: 1,
    3: 3,
    4: 8,
    5: 10
  }
}
```

---

## 🎨 Design System

### Color Palette

- **Primary (Accent):** `#f59e0b` (Amber/Orange)
- **Secondary:** `#0f172a` (Dark slate)
- **Background:** `#f8fafc` (Light slate)
- **Text:** `#0f172a`, `#475569`, `#64748b`
- **Borders:** `#e2e8f0`

### Animation Easing

```css
cubic-bezier(0.22, 1, 0.36, 1)  /* Spring easing - smooth, bouncy */
```

### Animations Used

- `card-enter` - Card slide up on mount
- `star-pop` - Star pop effect on click
- `tag-select` - Tag button selection animation
- `bar-grow` - Distribution bar growth animation
- `fade-in` - General content fade in

---

## 📱 Responsive Breakpoints

- **Desktop:** Full layout (1200px+)
- **Tablet:** Adjusted padding and font sizes (640px - 1200px)
- **Mobile:** Compact layout, single column (< 640px)

---

## 🔗 Integration Checklist

- [ ] Create `ratings` table in Supabase
- [ ] (Optional) Create `rating_tags` reference table
- [ ] Update booking validation logic in `checkBooking.js`
- [ ] Test rating submission with various datasets
- [ ] Add rating display to room detail pages
- [ ] Implement rating filters/sorting on listings
- [ ] Add user profile view for user's own ratings
- [ ] Create admin dashboard for rating moderation
- [ ] Add email notifications for ratings
- [ ] Set up analytics tracking for ratings

---

## 🐛 Troubleshooting

### Ratings not saving

1. Check Supabase connection in `supabaseClient.js`
2. Verify user has booked the room (check `bookings` table)
3. Check browser console for API errors
4. Ensure `ratings` table has correct schema

### Tags not displaying

1. Verify tags array is being passed to `submitRating()`
2. Check that tags match preset tags in component
3. Ensure JSON serialization is working

### Performance Issues

1. Add pagination to `getRoomRatings()` for large datasets
2. Implement caching in rating display
3. Use aggregation queries at database level
4. Consider materialized views for stats

---

## 🔐 Security Notes

- ✅ Server-side validation of rating values (1-5)
- ✅ User authentication required
- ✅ One rating per user per room (UNIQUE constraint)
- ✅ Row-level security policies recommended
- ⚠️ Implement rate limiting on rating submissions
- ⚠️ Consider spam detection for comments

---

## 📚 Future Enhancements

1. **AI Moderation** - Flag inappropriate comments
2. **Image Support** - Allow photo uploads with ratings
3. **Response** - Landlord responses to ratings
4. **Merits** - Helpful/unhelpful voting on reviews
5. **Verified Purchase Badge** - Show if user actually booked
6. **Rating Filters** - Sort by date, rating, helpfulness
7. **Sentiment Analysis** - Auto-categorize positive/negative
8. **Leaderboard** - Top-rated rooms/landlords

---

## 📞 Support

For issues or questions, contact the development team or check the main project README.
