import supabase from './supabaseClient';

/**
 * Comprehensive diagnostics for Supabase setup and data
 */
export async function runDiagnostics() {
  console.log('🔍 Running Supabase Diagnostics...\n');

  // 1. Check environment variables
  console.log('1️⃣ Environment Variables:');
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  console.log(`   REACT_APP_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '❌ Missing'}`);
  console.log(`   REACT_APP_SUPABASE_ANON_KEY: ${supabaseKey ? '✓ Set' : '❌ Missing'}`);

  // 2. Check connection
  console.log('\n2️⃣ Database Connection:');
  try {
    const { data, error } = await supabase.from('rooms').select('COUNT(*)');
    if (error) {
      console.log(`   ❌ Connection error: ${error.message}`);
      return;
    }
    console.log('   ✓ Connected to Supabase');
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err.message}`);
    return;
  }

  // 3. Check rooms table structure
  console.log('\n3️⃣ Rooms Table Structure:');
  try {
    const { data: allRooms, error: fetchError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.log(`   ❌ Error fetching rooms: ${fetchError.message}`);
      return;
    }

    if (allRooms && allRooms.length > 0) {
      const firstRoom = allRooms[0];
      console.log('   ✓ Rooms table exists with columns:');
      Object.keys(firstRoom).forEach(key => {
        console.log(`      - ${key}: ${typeof firstRoom[key]}`);
      });
    } else {
      console.log('   ⚠️ Rooms table exists but is EMPTY');
    }
  } catch (err) {
    console.log(`   ❌ Error checking table: ${err.message}`);
  }

  // 4. Count rooms
  console.log('\n4️⃣ Room Count:');
  try {
    const { count, error: countError } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log(`   ❌ Error counting: ${countError.message}`);
    } else {
      console.log(`   ${count} rooms in database`);
      if (count === 0) {
        console.log('   ⚠️ No rooms found - need to seed data!');
      }
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 5. List all roomIds
  console.log('\n5️⃣ Available Room IDs:');
  try {
    const { data: rooms, error: listError } = await supabase
      .from('rooms')
      .select('roomId, roomTitle')
      .limit(50);

    if (listError) {
      console.log(`   ❌ Error: ${listError.message}`);
    } else if (rooms && rooms.length > 0) {
      rooms.forEach(room => {
        console.log(`   - ID ${room.roomId}: ${room.roomTitle || 'No title'}`);
      });
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 6. Check specific roomId
  console.log('\n6️⃣ Checking Room ID 1:');
  try {
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('roomid', 1)
      .single();

    if (roomError) {
      console.log(`   ❌ Not found: ${roomError.message}`);
      
      // Try with different query
      console.log('   Trying alternative query without .single()...');
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('roomid', 1);
      
      if (rooms && rooms.length > 0) {
        console.log(`   ✓ Found: ${JSON.stringify(rooms[0], null, 2)}`);
      } else {
        console.log('   ❌ No results with alternative query either');
      }
    } else {
      console.log(`   ✓ Found: ${room.roomTitle}`);
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 7. Check bookings table
  console.log('\n7️⃣ Bookings Table:');
  try {
    const { count, error: bookError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    if (bookError) {
      console.log(`   ❌ Error: ${bookError.message}`);
    } else {
      console.log(`   ✓ ${count} bookings in database`);
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 8. Check ratings table
  console.log('\n8️⃣ Ratings Table:');
  try {
    const { count, error: ratError } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true });

    if (ratError) {
      console.log(`   ❌ Error: ${ratError.message}`);
    } else {
      console.log(`   ✓ ${count} ratings in database`);
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  console.log('\n✅ Diagnostics complete!');
}

/**
 * Manually insert a test room
 */
export async function insertTestRoom() {
  console.log('📝 Inserting test room...');
  
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{
        roomid: 1,
        roomtitle: 'Test Room',
        roomdescription: 'This is a test room',
        roomstatus: 'AVAILABLE',
        amount: 500,
        maxroommates: 2,
        bedrooms: 1,
        bathrooms: 1,
        city: 'San Francisco',
        country: 'USA'
      }])
      .select();

    if (error) {
      console.error('❌ Error inserting room:', error);
      return { success: false, error };
    }

    console.log('✓ Test room inserted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return { success: false, error: err };
  }
}

/**
 * Clear and reseed all rooms
 */
export async function clearAndReseedRooms() {
  console.log('🔄 Clearing and reseeding rooms...');

  try {
    // First, delete all existing rooms
    console.log('  Deleting existing rooms...');
    const { error: deleteError } = await supabase
      .from('rooms')
      .delete()
      .neq('roomid', -1); // Delete all where roomid != -1 (i.e., all)

    if (deleteError) {
      console.log('  ⚠️ Error deleting:', deleteError.message);
    } else {
      console.log('  ✓ Rooms cleared');
    }

    // Then insert sample data
    console.log('  Inserting sample rooms...');
    const sampleRooms = [
      {
        roomid: 1,
        roomtitle: 'Private Room in Modern Shared Apartment',
        roomdescription: 'Cozy private bedroom in a well-maintained shared apartment.',
        roomstatus: 'AVAILABLE',
        amount: 450,
        maxroommates: 2,
        bedrooms: 1,
        bathrooms: 1,
        totalroomarea: 25,
        roomtype: 'Apartment',
        addressline: '123 Main Street',
        city: 'San Francisco',
        country: 'USA',
        amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Hot Water', 'Furnished']),
        avgrating: 4.5,
        totalreviews: 12
      },
      {
        roomid: 2,
        roomtitle: 'Spacious Suite with Balcony',
        roomdescription: 'Large bedroom with en-suite bathroom and private balcony.',
        roomstatus: 'AVAILABLE',
        amount: 650,
        maxroommates: 1,
        bedrooms: 1,
        bathrooms: 1,
        totalroomarea: 35,
        roomtype: 'Suite',
        addressline: '456 Oak Avenue',
        city: 'San Francisco',
        country: 'USA',
        amenities: JSON.stringify(['WiFi', 'Parking', 'Furnished', 'Sea View']),
        avgrating: 4.8,
        totalreviews: 24
      },
      {
        roomid: 3,
        roomtitle: 'Cozy Studio in Downtown',
        roomdescription: 'Compact studio apartment perfect for solo travelers.',
        roomstatus: 'AVAILABLE',
        amount: 550,
        maxroommates: 1,
        bedrooms: 1,
        bathrooms: 1,
        totalroomarea: 20,
        roomtype: 'Studio',
        addressline: '789 Market Street',
        city: 'San Francisco',
        country: 'USA',
        amenities: JSON.stringify(['WiFi', 'Furnished', 'Shared Kitchen']),
        avgrating: 4.2,
        totalreviews: 8
      }
    ];

    const { data, error: insertError } = await supabase
      .from('rooms')
      .insert(sampleRooms)
      .select();

    if (insertError) {
      console.log('  ❌ Error inserting rooms:', insertError.message);
      return { success: false, error: insertError };
    }

    console.log('  ✓ Sample rooms inserted:', data.length, 'rooms');
    return { success: true, data };
  } catch (err) {
    console.error('  ❌ Unexpected error:', err);
    return { success: false, error: err };
  }
}
