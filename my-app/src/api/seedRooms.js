import supabase from './supabaseClient';

/**
 * Seeds sample room data into Supabase for demonstration
 * Call this once to populate the rooms table
 */
export async function seedSampleRooms() {
  const sampleRooms = [
    {
      roomid: 1,
      roomtitle: 'Private Room in Modern Shared Apartment',
      roomdescription: 'Cozy private bedroom in a well-maintained shared apartment. Perfect for students or professionals. Located in the heart of the city with easy access to public transport.',
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
      amenities: ['WiFi', 'Air Conditioning', 'Hot Water', 'Furnished'],
      allergies: ['No pets', 'No smoking'],
      rentername: 'John Landlord',
      renterimage: 'https://via.placeholder.com/80',
      avgrating: 4.5,
      totalreviews: 12
    },
    {
      roomid: 2,
      roomtitle: 'Spacious Suite with Balcony',
      roomdescription: 'Large bedroom with en-suite bathroom and private balcony. Modern amenities and furnished.',
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
      amenities: ['WiFi', 'Parking', 'Furnished', 'Sea View'],
      allergies: [],
      rentername: 'Jane Smith',
      renterimage: 'https://via.placeholder.com/80',
      avgrating: 4.8,
      totalreviews: 24
    },
    {
      roomid: 3,
      roomtitle: 'Cozy Studio in Downtown',
      roomdescription: 'Compact studio apartment perfect for solo travelers or short-term stays. Fully equipped kitchen.',
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
      amenities: ['WiFi', 'Furnished', 'Shared Kitchen', 'Common Area'],
      allergies: ['No pets'],
      rentername: 'Mike Johnson',
      renterimage: 'https://via.placeholder.com/80',
      avgrating: 4.2,
      totalreviews: 8
    }
  ];

  try {
    console.log('Starting to seed sample rooms...');

    // Check if rooms already exist
    const { data: existingRooms, error: checkError } = await supabase
      .from('rooms')
      .select('roomId')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing rooms:', checkError);
      return { success: false, error: checkError };
    }

    // Only seed if table is empty
    if (existingRooms && existingRooms.length === 0) {
      console.log('Table is empty, inserting sample rooms...');
      const { data, error } = await supabase
        .from('rooms')
        .insert(sampleRooms)
        .select();

      if (error) {
        console.error('Error seeding rooms:', error);
        return { success: false, error };
      }

      console.log('✓ Successfully seeded sample rooms:', data);
      return { success: true, data };
    } else {
      console.log('✓ Rooms table already has data, skipping seed');
      return { success: true, message: 'Table already populated' };
    }
  } catch (err) {
    console.error('Unexpected error seeding rooms:', err);
    return { success: false, error: err };
  }
}

/**
 * Verifies rooms exist in the database
 */
export async function verifyRoomsExist() {
  try {
    const { data, error, count } = await supabase
      .from('rooms')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error verifying rooms:', error);
      return { exists: false, error };
    }

    console.log(`✓ Found ${count} rooms in database`);
    return { exists: true, count, rooms: data };
  } catch (err) {
    console.error('Error verifying rooms:', err);
    return { exists: false, error: err };
  }
}
