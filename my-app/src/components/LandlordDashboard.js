import React, { useState, useEffect, useCallback } from 'react';
import './LandlordDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import supabase from '../api/supabaseClient';
import axiosClient from '../api/rumi_client';

/* ── Helpers ── */
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${session.access_token}` };
};

const formatPrice = (listing) => {
  if (!listing.amount) return 'Price N/A';
  return `LKR ${parseInt(listing.amount).toLocaleString('en-LK')} / month`;
};

const getFirstImage = (listing) =>
  'https://via.placeholder.com/600x400?text=' + encodeURIComponent(listing.roomtitle || 'Room');

/* ── Listing Card ── */
const ListingCard = ({ listing, onDelete, onView, deleting }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // Fetch images from Supabase storage when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const roomId = listing.roomid;
        console.log(`📷 ListingCard: Fetching images for room ${roomId}...`);
        
        const { data: storageFiles, error: storageError } = await supabase.storage
          .from('RoomImages')
          .list(String(roomId), { limit: 100, offset: 0 });

        console.log(`📷 Storage response for room ${roomId}:`, { 
          error: storageError?.message, 
          fileCount: storageFiles?.length,
          files: storageFiles?.map(f => f.name)
        });

        if (!storageError && storageFiles && storageFiles.length > 0) {
          const fileUrls = storageFiles
            .filter(file => file.name.length > 0)
            .map(file => {
              const { data: urlData } = supabase.storage
                .from('RoomImages')
                .getPublicUrl(`${roomId}/${file.name}`);
              console.log(`  📷 Generated URL for ${file.name}:`, urlData?.publicUrl);
              return urlData?.publicUrl;
            })
            .filter(url => url);

          console.log(`✅ Found ${fileUrls.length} images for room ${roomId}`);
          setImages(fileUrls);
        } else {
          console.log(`⚠️ No images found for room ${roomId}, using placeholder`);
          setImages([getFirstImage(listing)]);
        }
      } catch (err) {
        console.error('❌ Could not fetch listing images:', err);
        setImages([getFirstImage(listing)]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [listing.roomid]);

  const displayImages = images.length > 0 ? images : [getFirstImage(listing)];
  const imgSrc = displayImages[imgIdx];
  const location = listing.city || listing.country ? `${listing.city || ''}${listing.country ? ', ' + listing.country : ''}` : 'Location N/A';

  const prevImg = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + displayImages.length) % displayImages.length); };
  const nextImg = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % displayImages.length); };

  return (
    <div className="ld-listing-card">
      <div className="ld-listing-img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={listing.roomtitle} className="ld-listing-img" />
        ) : (
          <div className="ld-listing-img ld-listing-img-placeholder">
            <span>No Image</span>
          </div>
        )}
        {displayImages.length > 1 && (
          <>
            <button className="ld-img-arrow prev" onClick={prevImg} aria-label="Previous image">&#8249;</button>
            <button className="ld-img-arrow next" onClick={nextImg} aria-label="Next image">&#8250;</button>
            <div className="ld-img-dots">
              {displayImages.map((_, i) => (
                <div key={i} className={`ld-img-dot${i === imgIdx ? ' active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="ld-listing-body">
        <div className="ld-listing-top">
          <div>
            <p className="ld-listing-title">{listing.roomtitle}</p>
            <p className="ld-listing-location">{location}</p>
          </div>
          <span className={`ld-badge ${listing.roomstatus === 'AVAILABLE' ? 'ld-badge-active' : 'ld-badge-review'}`}>
            {listing.roomstatus === 'AVAILABLE' ? 'Active' : listing.roomstatus || 'Pending'}
          </span>
        </div>
        <div className="ld-listing-footer">
          <span className="ld-listing-price">{formatPrice(listing)}</span>
          <div className="ld-listing-meta">
            <span className="ld-listing-type">{listing.roomtype || 'Room'}</span>
            {listing.maxRoommates > 0 && (
              <>
                <span className="ld-dot">·</span>
                <span className="ld-listing-type">{listing.maxRoommates} max</span>
              </>
            )}
          </div>
          <div className="ld-listing-actions">
            <button className="ld-view-btn" onClick={() => onView(listing.roomid)}>View</button>
            <button
              className="ld-delete-btn"
              onClick={() => onDelete(listing.roomid)}
              disabled={deleting}
            >
              {deleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [listingsError, setListingsError] = useState('');

  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successId, setSuccessId] = useState(null);

  const [formData, setFormData] = useState({
    roomTitle: '',
    roomDescription: '',
    genderAllowed: 'OTHER',
    maxRoommates: 1,
    roomStatus: 'AVAILABLE',
    roomType: 'STUDIO',
    houseNumber: '',
    addressLine: '',
    city: '',
    country: '',
    amount: '',
    advance: '',
    billingCycle: 'MONTHLY',
  });
  const [images, setImages] = useState([]);

  /* ── Fetch real listings ── */
  const fetchMyListings = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingListings(true);
      setListingsError('');
      // Fetch all rooms from Supabase
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        setListingsError('Could not load your listings.');
        return;
      }
      setListings(rooms || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListingsError('Could not load your listings. Please refresh.');
    } finally {
      setLoadingListings(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  /* ── Delete listing ── */
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
    try {
      setDeletingId(roomId);
      // Delete from Supabase (use CAMELCASE column name)
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('roomid', roomId);
      
      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete listing. Please try again.');
        return;
      }
      setListings(prev => prev.filter(l => l.roomId !== roomId));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Form handlers ── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setSuccessId(null);

    try {
      if (!user) {
        setMessage('❌ Please log in to create listings');
        return;
      }
      if (!formData.roomTitle || !formData.roomDescription || !formData.city || !formData.amount) {
        setMessage('❌ Please fill in all required fields');
        return;
      }

      // Generate a new roomId (using timestamp + random number)
      const newRoomId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000);
      console.log('✓ Generated roomId:', newRoomId);

      // Insert directly to Supabase (use CAMELCASE column names to match schema)
      const roomData = {
        roomid: newRoomId,
        roomtitle: formData.roomTitle,
        roomdescription: formData.roomDescription,
        roomstatus: formData.roomStatus,
        amount: parseInt(formData.amount),
        maxroommates: parseInt(formData.maxRoommates) || 1,
        bedrooms: 1,
        bathrooms: 1,
        totalroomarea: 25,
        roomtype: formData.roomType,
        addressline: formData.addressLine || 'N/A',
        city: formData.city,
        country: formData.country,
        amenities: [],
        allergies: [],
        rentername: user.email || 'Landlord',
        renterimage: 'https://via.placeholder.com/80',
        avgrating: 0,
        totalreviews: 0,
      };

      const { data: insertedRoom, error: insertError } = await supabase
        .from('rooms')
        .insert([roomData])
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        setMessage(`❌ Error: ${insertError.message}`);
        return;
      }

      console.log('✓ Insert successful');
      
      const roomId = newRoomId;
      setSuccessId(roomId);
      
      // Upload images to Supabase storage if any
      if (images.length > 0) {
        console.log(`📸 Uploading ${images.length} images for room ${roomId}...`);
        let uploadedCount = 0;
        
        try {
          for (let img of images) {
            try {
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
              console.log(`  Uploading image: ${fileName}`);
              
              const { data, error: uploadError } = await supabase.storage
                .from('RoomImages')
                .upload(`${roomId}/${fileName}`, img, {
                  cacheControl: '3600',
                  upsert: false
                });

              if (uploadError) {
                console.error(`    ❌ Upload failed:`, uploadError);
              } else {
                console.log(`    ✓ Uploaded:`, data?.path);
                uploadedCount++;
              }
            } catch (singleImgErr) {
              console.error(`    ❌ Error uploading single image:`, singleImgErr);
            }
          }
          
          if (uploadedCount > 0) {
            setMessage(`✅ Room created! ID: ${roomId} with ${uploadedCount}/${images.length} images`);
          } else if (uploadedCount === 0 && images.length > 0) {
            setMessage(`⚠️ Room created (ID: ${roomId}) but images failed to upload`);
          }
        } catch (imgErr) {
          console.error('Image upload error:', imgErr);
          setMessage(`✅ Room created! ID: ${roomId} (images: ${imgErr.message})`);
        }
      } else {
        setMessage(`✅ Room created! ID: ${roomId}`);
      }

      // Reset form
      setFormData({
        roomTitle: '', roomDescription: '', genderAllowed: 'OTHER',
        maxRoommates: 1, roomStatus: 'AVAILABLE', roomType: 'STUDIO',
        houseNumber: '', addressLine: '', city: '', country: '',
        amount: '', advance: '', billingCycle: 'MONTHLY',
      });
      setImages([]);

      // Refresh listings
      await fetchMyListings();

    } catch (err) {
      console.error('Error creating room:', err);
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ── Stats ── */
  const activeCount = listings.filter(l => l.roomStatus === 'AVAILABLE').length;
  const totalCount = listings.length;

  return (
    <div className="ld-page">
      {/* ── Left image panel ── */}
      <div className="ld-image-section">
        <div className="ld-logo-section">
          <div className="ld-logo"><span className="ld-logo-text">RUMI</span></div>
        </div>
        <img
          src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&h=900&w=600"
          alt="Property"
          className="ld-bg-image"
        />
        <div className="ld-image-overlay">
          <div className="ld-overlay-badge">Landlord</div>
          <div className="ld-overlay-text">
            <h2>Welcome back,</h2>
            <h2>Landlord</h2>
            <p className="ld-overlay-sub">Manage your spaces with ease</p>
          </div>
        </div>
      </div>

      {/* ── Right dashboard panel ── */}
      <div className="ld-dashboard-section">

        {/* POST FORM VIEW */}
        {showPostForm ? (
          <div className="ld-form-container">
            <div className="ld-form-header">
              <h2>Post New Listing</h2>
              <button className="ld-close-btn" onClick={() => { setShowPostForm(false); setMessage(''); }}>✕</button>
            </div>

            {!user && (
              <div className="ld-auth-notice">
                ℹ️ <strong>Sign In</strong> to post listings with your account.
              </div>
            )}

            {message && (
              <div className={`ld-message ${message.includes('✅') ? 'ld-success' : 'ld-error'}`}>
                {message}
                {successId && message.includes('✅') && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid currentColor' }}>
                    <button
                      onClick={() => navigate(`/listing/${successId}`)}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      👁️ View Posted Listing
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="ld-post-form">
              <fieldset className="ld-fieldset">
                <legend>Room Information</legend>
                <input type="text" name="roomTitle" placeholder="Room Title (e.g., Spacious Bedroom in Colombo)"
                  value={formData.roomTitle} onChange={handleInputChange} required />
                <textarea name="roomDescription" placeholder="Describe your room..."
                  value={formData.roomDescription} onChange={handleInputChange} rows="3" required />
                <div className="ld-form-row">
                  <select name="genderAllowed" value={formData.genderAllowed} onChange={handleInputChange}>
                    <option value="OTHER">Any Gender</option>
                    <option value="MALE">Male Only</option>
                    <option value="FEMALE">Female Only</option>
                  </select>
                  <input type="number" name="maxRoommates" placeholder="Max Roommates"
                    value={formData.maxRoommates} onChange={handleInputChange} min="1" max="10" />
                </div>
                <div className="ld-form-row-full">
                  <select name="roomStatus" value={formData.roomStatus} onChange={handleInputChange}>
                    <option value="AVAILABLE">Status: Available</option>
                    <option value="FULL">Full</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <select name="roomType" value={formData.roomType} onChange={handleInputChange}>
                    <option value="STUDIO">Room Type: Studio</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="ANNEX">Annex</option>
                    <option value="HOUSE">House</option>
                    <option value="BOARDING">Boarding</option>
                  </select>
                </div>
              </fieldset>

              <fieldset className="ld-fieldset">
                <legend>Location</legend>
                <div className="ld-form-row">
                  <input type="text" name="houseNumber" placeholder="House/Apt Number"
                    value={formData.houseNumber} onChange={handleInputChange} />
                  <input type="text" name="addressLine" placeholder="Street Address"
                    value={formData.addressLine} onChange={handleInputChange} />
                </div>
                <div className="ld-form-row">
                  <input type="text" name="city" placeholder="City"
                    value={formData.city} onChange={handleInputChange} required />
                  <input type="text" name="country" placeholder="Country"
                    value={formData.country} onChange={handleInputChange} />
                </div>
              </fieldset>

              <fieldset className="ld-fieldset">
                <legend>Pricing</legend>
                <div className="ld-form-row">
                  <input type="number" name="amount" placeholder="Monthly Rent (LKR)"
                    value={formData.amount} onChange={handleInputChange} required />
                  <input type="number" name="advance" placeholder="Advance Required (LKR)"
                    value={formData.advance} onChange={handleInputChange} required />
                </div>
                <select name="billingCycle" value={formData.billingCycle} onChange={handleInputChange}>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </fieldset>

              <fieldset className="ld-fieldset">
                <legend>Room Images</legend>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                {images.length > 0 && (
                  <div className="ld-image-preview">
                    {images.map((img, i) => (
                      <div key={i} className="ld-img-item">
                        <img src={URL.createObjectURL(img)} alt={`preview-${i}`} />
                        <button type="button" onClick={() => removeImage(i)} className="ld-remove-img">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              <button type="submit" disabled={loading} className="ld-submit-btn">
                {loading ? '📤 Posting...' : '📤 Post Listing'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="ld-dashboard-header">
              <div>
                <h2 className="ld-dashboard-title">Landlord Dashboard</h2>
                <p className="ld-dashboard-subtitle">Your property overview</p>
              </div>
              <button className="ld-logout-btn" onClick={() => navigate('/login')}>Logout</button>
            </div>

            {/* Stats row */}
            <div className="ld-stats-row">
              <div className="ld-stat-card">
                <p className="ld-stat-value">{loadingListings ? '—' : totalCount}</p>
                <p className="ld-stat-label">Total Listings</p>
              </div>
              <div className="ld-stat-card">
                <p className="ld-stat-value">{loadingListings ? '—' : activeCount}</p>
                <p className="ld-stat-label">Active</p>
              </div>
            </div>

            {/* Current Listings */}
            <div className="ld-section">
              <h3 className="ld-section-title">My Listings</h3>

              {loadingListings ? (
                <p className="ld-empty">Loading your listings...</p>
              ) : listingsError ? (
                <div className="ld-listings-error">
                  <p>{listingsError}</p>
                  <button className="ld-retry-btn" onClick={fetchMyListings}>Retry</button>
                </div>
              ) : listings.length === 0 ? (
                <p className="ld-empty">No listings yet. Post your first one below!</p>
              ) : (
                <div className="ld-listings-list">
                  {listings.map(l => (
                    <ListingCard
                      key={l.roomid}
                      listing={l}
                      onDelete={handleDelete}
                      onView={(id) => navigate(`/listing/${id}`)}
                      deleting={deletingId === l.roomid}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Post New Listing CTA */}
            <button className="ld-post-btn" onClick={() => setShowPostForm(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Post New Listing
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
