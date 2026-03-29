# Admin Dashboard Setup Status

## Current Status: Core Setup Complete ✅

The backend and frontend are now running with proper configuration. However, there's one final step needed.

### What's Been Fixed:
1. ✅ Backend is running on port 8082 with correct Supabase configuration
2. ✅ Frontend is running on port 3000 with correct Supabase configuration  
3. ✅ Database connection working properly
4. ✅ Admin user exists in the database (admin@gmail.com)
5. ✅ Enhanced logging added to identify authentication issues
6. ✅ Environment variables properly configured in both frontend and backend

### Identified Issue:
The backend logs show: `"Session from session_id claim in JWT does not exist"`

This means Supabase requires a valid session to be established. The issue is that:
- The  frontend needs to authenticate with Supabase properly
- A valid session needs to be created in Supabase before the JWT can be used with the backend

### How to Complete the Setup:

#### Step 1: Log in with the admin account
1. Open http://localhost:3000 in your browser (should already be open)
2. You should see the login page
3. Log in with:
   - **Email**: admin@gmail.com
   - **Password**: (Use whatever password you set for this account in Supabase)
   
If you don't remember the password, you need to:
- Go to your Supabase project dashboard
- Go to SQL Editor
- Create a new test user OR reset the admin@gmail.com password

#### Step 2: After successful login
- The admin dashboard should automatically navigate to `/admin`
- The pending listings and users should load
- You should see the approval interface

### Testing the API Directly (if needed):

If you want to test with a real token:
1. Log in at http://localhost:3000
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Run this command:
   ```javascript
   const {data:{session}}=await supabase.auth.getSession();
   console.log(session.access_token)
   ```
5. Copy the token
6. Test with curl or PowerShell:
   ```powershell
   $token = "YOUR_TOKEN_HERE"
   Invoke-WebRequest -Uri "http://localhost:8082/api/admin/listings/pending?page=0&size=100" `
     -Headers @{"Authorization"="Bearer $token"} `
     -ErrorAction Continue
   ```

### Database Admin Setup Endpoint

If you want to manually set up an admin user without using Supabase auth:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8082/api/admin/setup/create-admin-direct" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"userId":"USER_ID_HERE","email":"admin@gmail.com","fullName":"Admin User"}'

$response.Content
```

### Configuration Files:

**Backend Environment Variables** (set when starting Java):
- `DB_URL`: jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
- `DB_USERNAME`: postgres.uuicntunejvvwzfcypey
- `DB_PASSWORD`: Y3T9VnHSMZIoQ29j
- `SUPABASE_URL`: https://uuicntunejvvwzfcypey.supabase.co
- `SUPABASE_ANON_KEY`: [Configured in .env]

**Frontend Configuration** (my-app/.env):
- `REACT_APP_SUPABASE_URL`: https://uuicntunejvvwzfcypey.supabase.co
- `REACT_APP_SUPABASE_ANON_KEY`: [Configured in .env]
- `REACT_APP_API_BASE_URL`: http://localhost:8082/api

### Next Steps:

1. Log in to the frontend with admin@gmail.com
2. The admin dashboard should work
3. You should be able to:
   - View pending listings
   - Approve/reject listings
   - View admin users
   - Ban/unban users

### If Still Getting 500 Errors:

Check the backend logs for detailed error messages. The backend now logs detailed information about:
- Supabase URL being used
- HTTP status codes from Supabase
- Response body from Supabase
- Stack traces for debugging

Run the backend with debug logging to see more details:
```
# Backend logs are now set to DEBUG level for the app package
logging.level.com.rumi.rumi_backend_v2=DEBUG
```

### Restart Commands (if needed):

**Restart Backend:**
```powershell
Push-Location "C:\Users\senir\OneDrive\ドキュメント\GitHub\rumi_main\rumi_main\rumi_backend_v2"
$env:DB_URL="jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
$env:DB_USERNAME="postgres.uuicntunejvvwzfcypey"
$env:DB_PASSWORD="Y3T9VnHSMZIoQ29j"
$env:SUPABASE_URL="https://uuicntunejvvwzfcypey.supabase.co"
$env:SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aWNudHVuZWp2dnd6ZmN5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDUwNzUsImV4cCI6MjA4NzgyMTA3NX0.DFe1MmDwn7HOxyvvfmOKF8AvzBTKZMQsrBP9YhD1UX0"
$env:SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aWNudHVuZWp2dnd6ZmN5cGV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI0NTA3NSwiZXhwIjoyMDg3ODIxMDc1fQ.pWmxzNyhJWSkRWPlzgUPq7g1QCVG_OK7rUdZ0e-DlrU"
$env:SUPABASE_BUCKET="RoomImages"
java -jar target/backend.jar --server.port=8082
Pop-Location
```

**Restart Frontend:**
```powershell
cd "c:\Users\senir\OneDrive\ドキュメント\GitHub\rumi_main\rumi_main\my-app"
npm start
```

---

**Last Updated**: 2026-03-30  
**Backend Status**: Running on port 8082  
**Frontend Status**: Running on port 3000
