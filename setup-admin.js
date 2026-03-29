const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uuicntunejvvwzfcypey.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aWNudHVuZWp2dnd6ZmN5cGV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI0NTA3NSwiZXhwIjoyMDg3ODIxMDc1fQ.pWmxzNyhJWSkRWPlzgUPq7g1QCVG_OK7rUdZ0e-DlrU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Create user with Supabase admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@rumi.com',
      password: 'Admin@123456!',
      email_confirm: true // Auto-confirm the email
    });
    
    if (error) {
      console.error('Error creating user:', error);
      return;
    }
    
    console.log('Admin user created:', data.user.id);
    console.log('Email:', data.user.email);
    
    // Get access token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.getUserById(data.user.id);
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return;
    }
    
    console.log('User:', sessionData.user);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupAdmin();
