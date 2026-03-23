# 🚨 SUPABASE TABLE ERROR - FIX NOW

## Problem
`Could not find the table 'public.rooms' in the schema cache`

This means the `rooms` table doesn't exist in your Supabase database.

---

## ✅ SOLUTION - Run SQL in Supabase

### Step 1: Go to Supabase
1. Open https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **+ New Query**

### Step 2: Copy & Paste SQL
1. Open the file: `SUPABASE_SCHEMA.sql` in this folder
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **RUN** (or Ctrl+Enter)

### Step 3: Verify
You should see:
```
Setup Complete!
 
rooms
bookings
ratings
```

This means all 3 tables were created successfully! ✓

### Step 4: Refresh Your App
1. Go back to your app
2. Hard refresh: `Ctrl+Shift+R`
3. Click the 🔧 button
4. Click **🌱 Reseed Rooms**
5. Go to http://localhost:3000/listing/1

---

## 🔍 Alternative: Check if Tables Exist

If you want to verify without running the schema, run this quick SQL in Supabase:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

**Expected output:**
- bookings
- ratings  
- rooms

If `rooms` is missing, run the full schema SQL above.

---

## 📋 What This SQL Creates

| Table | Purpose |
|-------|---------|
| `rooms` | All room listings |
| `bookings` | User bookings |
| `ratings` | Room reviews & ratings |

All with proper:
- ✓ Unique constraints
- ✓ Foreign keys
- ✓ Indexes for performance
- ✓ Row Level Security policies
- ✓ Sample data (3 rooms)

---

## 🔗 Files to Reference

- **SQL Schema**: `./SUPABASE_SCHEMA.sql`
- **Schema Setup**: `./SUPABASE_SETUP.md`
- **Help Tools**: Browser console → `window.supabase_diagnostics.help()`

---

## 💡 Questions?

1. Tables missing? → Run SQL schema above
2. Still getting errors? → Open 🔧 DevHelper and run diagnostics
3. Data not showing? → Check RLS policies in Supabase Dashboard

---

**Your tables will be created with:**
- 3 sample rooms ready to book
- Full authentication support
- Proper security policies

Ready to go! 🎉
