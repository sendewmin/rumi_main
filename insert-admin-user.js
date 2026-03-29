const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-ap-southeast-1.supabase.com',
  port: 5433,
  user: 'postgres.uuicntunejvvwzfcypey',
  password: 'Y3T9VnHSMZIoQ29j',
  database: 'postgres',
  ssl: true,
});

async function insertAdminUser() {
  try {
    console.log('Connecting to Supabase...');
    const client = await pool.connect();
    
    const sql = `
      INSERT INTO app_user (
        user_id,
        full_name, 
        email,
        phone_number,
        role,
        status,
        profile_complete,
        phone_verified
      ) VALUES (
        'e0878347-b681-4b27-b439-b89544c5b4b9',
        'admin rumi',
        'admin@gmail.com',
        '55656',
        'ADMIN',
        'ACTIVE',
        true,
        false
      )
      ON CONFLICT (user_id) DO UPDATE SET
        role = 'ADMIN',
        status = 'ACTIVE',
        email = 'admin@gmail.com',
        phone_number = '55656',
        full_name = 'admin rumi'
      WHERE app_user.user_id = 'e0878347-b681-4b27-b439-b89544c5b4b9';
    `;
    
    console.log('Executing SQL...');
    await client.query(sql);
    
    // Verify
    const verifyResult = await client.query(
      'SELECT user_id, full_name, email, role, status FROM app_user WHERE user_id = $1',
      ['e0878347-b681-4b27-b439-b89544c5b4b9']
    );
    
    console.log('\n✅ Admin user inserted/updated successfully!');
    console.log('User record:', verifyResult.rows[0]);
    
    client.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

insertAdminUser();
