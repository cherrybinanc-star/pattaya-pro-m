import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('home');
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [catServices, setCatServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);
  const [toast, setToast] = useState('');

  // Booking form state
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookAddr, setBookAddr] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) loadHome();
  }, [user]);

  const loadHome = async () => {
    try {
      const [cats, pop] = await Promise.all([api.getCategories(), api.getPopular()]);
      setCategories(cats);
      setPopular(pop);
    } catch (err) { console.error(err); }
  };

  const loadBookings = async () => {
    try { setBookings(await api.getBookings()); } catch (err) { console.error(err); }
  };

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    try { setSearchResults(await api.search(searchQ)); } catch (err) { console.error(err); }
  };

  const openCategory = async (cat) => {
    setSelectedCat(cat);
    setTab('category');
    try { setCatServices(await api.getCategoryServices(cat.id)); } catch (err) { console.error(err); }
  };

  const openService = async (svc) => {
    setSelectedService(svc);
    setTab('detail');
    try { setServiceDetail(await api.getService(svc.id)); } catch (err) { console.error(err); }
  };

  const openBookingModal = (svc) => {
    setBookingModal(svc);
    setBookDate('');
    setBookTime('');
    setBookAddr(user?.address || '');
    setBookNotes('');
  };

  const submitBooking = async () => {
    if (!bookDate || !bookTime || !bookAddr) return showToast('Fill date, time & address');
    setSubmitting(true);
    try {
      await api.createBooking({
        serviceId: bookingModal.id,
        date: bookDate,
        timeSlot: bookTime,
        address: bookAddr,
        notes: bookNotes,
      });
      showToast('Booking created! 🎉');
      setBookingModal(null);
      setTab('bookings');
      loadBookings();
    } catch (err) { showToast(err.message); }
    setSubmitting(false);
  };

  const cancelBooking = async (id) => {
    try {
      await api.cancelBooking(id, 'Changed my mind');
      showToast('Booking cancelled');
      loadBookings();
    } catch (err) { showToast(err.message); }
  };

  const [reviewId, setReviewId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const submitReview = async () => {
    try {
      await api.reviewBooking(reviewId, reviewRating, reviewComment);
      showToast('Review submitted! ⭐');
      setReviewId(null);
      loadBookings();
    } catch (err) { showToast(err.message); }
  };

  if (authLoading || !user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  // ─── HOME TAB ───
  const HomeTab = () => (
    <div style={{ padding: '0 18px 20px' }}>
      {/* Search */}
      <div style={{ display: 'flex', gap: 8, margin: '4px 0 18px' }}>
        <div className="input-field" style={{ flex: 1, margin: 0, padding: '10px 14px' }}>
          <span>🔍</span>
          <input
            placeholder="Search services..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button onClick={handleSearch} className="btn btn-teal" style={{ padding: '10px 18px' }}>Search</button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Search Results</h3>
            <span onClick={() => setSearchResults([])} style={{ fontSize: 12, color: 'var(--pri)', cursor: 'pointer', fontWeight: 600 }}>Clear ✕</span>
          </div>
          {searchResults.map(s => (
            <div key={s.id} className="card" onClick={() => openService(s)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(12,124,124,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon || '🔧'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.category?.name} · {s.duration}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--pri-d)' }}>฿{s.price}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Categories */}
      <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 12px' }}>Browse Services</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: 10, marginBottom: 20 }}>
        {categories.map(c => (
          <div key={c.id} onClick={() => openCategory(c)} style={{
            background: 'white', borderRadius: 16, padding: 14, textAlign: 'center',
            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{c.name}</div>
            <div style={{ fontSize: 9, color: 'var(--gray)' }}>{c.nameTh}</div>
          </div>
        ))}
      </div>

      {/* Popular Services */}
      {popular.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 12px' }}>🔥 Popular Services</h3>
          {popular.map(s => (
            <div key={s.id} className="card" onClick={() => openService(s)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, rgba(12,124,124,0.1), rgba(212,160,32,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon || '✨'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.category?.name} · {s.duration}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--pri-d)' }}>฿{s.price}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray)', textAlign: 'right' }}>base price</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );

  // ─── CATEGORY TAB ───
  const CategoryTab = () => (
    <div style={{ padding: '0 18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={() => setTab('home')} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{selectedCat?.icon} {selectedCat?.name}</h2>
      </div>
      {catServices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No services in this category</div>
      ) : catServices.map(s => (
        <div key={s.id} className="card" onClick={() => openService(s)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(12,124,124,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon || '🔧'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.description}</div>
              <div style={{ fontSize: 11, color: 'var(--dark-m)', marginTop: 2 }}>⏱ {s.duration}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--pri-d)' }}>฿{s.price}</div>
              <button onClick={(e) => { e.stopPropagation(); openBookingModal(s); }} className="btn btn-teal" style={{ padding: '6px 14px', fontSize: 11, marginTop: 6 }}>Book →</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── DETAIL TAB ───
  const DetailTab = () => {
    const svc = serviceDetail || selectedService;
    if (!svc) return null;
    return (
      <div style={{ padding: '0 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button onClick={() => selectedCat ? setTab('category') : setTab('home')} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }}>← Back</button>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 140, background: 'linear-gradient(135deg, var(--pri-dd), var(--pri), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 56 }}>{svc.icon || '✨'}</span>
          </div>
          <div style={{ padding: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>{svc.name}</h2>
            {svc.nameTh && <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>{svc.nameTh}</div>}
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--dark-m)' }}>📁 {svc.category?.name}</span>
              <span style={{ fontSize: 13, color: 'var(--dark-m)' }}>⏱ {svc.duration}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--dark-m)', lineHeight: 1.65, marginBottom: 16 }}>{svc.description || 'Professional service by verified providers.'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--pri-d)' }}>฿{svc.price}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>+ ฿49 platform fee</div>
              </div>
              <button onClick={() => openBookingModal(svc)} className="btn btn-teal" style={{ padding: '14px 28px', fontSize: 15 }}>Book Now →</button>
            </div>
          </div>
        </div>

        {/* Available providers */}
        {serviceDetail?.providers?.length > 0 && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '20px 0 10px' }}>Available Providers</h3>
            {serviceDetail.providers.map(p => (
              <div key={p.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--pri), var(--pri-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>{p.name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>⭐ {p.rating} · {p.totalJobs} jobs</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {p.isVerified && <span style={{ fontSize: 10, background: 'rgba(26,174,92,0.1)', color: 'var(--green)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>Verified</span>}
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.isOnline ? 'var(--green)' : 'var(--gray-l)' }} />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  // ─── BOOKINGS TAB ───
  const BookingsTab = () => {
    const [filter, setFilter] = useState('');
    useEffect(() => { loadBookings(); }, []);
    const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;
    const statusColor = (s) => {
      const map = { pending: 'var(--gold)', confirmed: 'var(--blue)', in_progress: 'var(--pri)', completed: 'var(--green)', cancelled: 'var(--red)' };
      return map[s] || 'var(--gray)';
    };

    return (
      <div style={{ padding: '0 18px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '6px 0 14px' }}>📋 My Bookings</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn btn-teal' : 'btn btn-ghost'} style={{ padding: '6px 14px', fontSize: 11 }}>
              {s || 'All'}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>No bookings yet</div>
            <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>Browse services and book your first one!</div>
            <button onClick={() => setTab('home')} className="btn btn-teal" style={{ marginTop: 16, padding: '10px 24px', fontSize: 13 }}>Browse Services →</button>
          </div>
        ) : filtered.map(b => (
          <div key={b.id} className="card" style={{ borderLeft: `4px solid ${statusColor(b.status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{b.service?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>{b.bookingNo}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: `${statusColor(b.status)}15`, color: statusColor(b.status), textTransform: 'capitalize' }}>
                {b.status?.replace('_', ' ')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--dark-m)', flexWrap: 'wrap', marginBottom: 6 }}>
              <span>📅 {new Date(b.date).toLocaleDateString()}</span>
              <span>🕐 {b.timeSlot}</span>
              <span>📍 {b.address}</span>
            </div>
            {b.partner && <div style={{ fontSize: 12, color: 'var(--dark-m)', marginBottom: 6 }}>🔧 {b.partner.name} {b.partner.rating ? `· ⭐ ${b.partner.rating}` : ''}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--pri-d)' }}>฿{b.totalAmount}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {b.status === 'completed' && !b.review && (
                  <button onClick={() => { setReviewId(b.id); setReviewRating(5); setReviewComment(''); }} className="btn btn-pri" style={{ padding: '7px 14px', fontSize: 11 }}>⭐ Review</button>
                )}
                {['pending', 'confirmed'].includes(b.status) && (
                  <button onClick={() => cancelBooking(b.id)} className="btn btn-danger" style={{ padding: '7px 14px', fontSize: 11 }}>Cancel</button>
                )}
              </div>
            </div>
            {b.review && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(212,160,32,0.08)', borderRadius: 10, fontSize: 12 }}>⭐ {b.review.rating}/5 {b.review.comment && `— "${b.review.comment}"`}</div>}
          </div>
        ))}
      </div>
    );
  };

  // ─── PROFILE TAB ───
  const ProfileTab = () => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const saveProfile = async () => {
      try {
        await api.updateProfile({ name, phone });
        showToast('Profile updated! ✅');
        setEditing(false);
      } catch (err) { showToast(err.message); }
    };

    return (
      <div style={{ padding: '0 18px 20px' }}>
        <div style={{ textAlign: 'center', padding: '18px 0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--pri), var(--pri-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 32, color: 'white', fontWeight: 800 }}>{user.name?.[0]}</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 2px' }}>{user.name}</h2>
          <p style={{ color: 'var(--gray)', fontSize: 12, margin: 0 }}>{user.email}</p>
        </div>

        {editing ? (
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Edit Profile</h3>
            <div className="input-group">
              <label>Name</label>
              <div className="input-field"><span>👤</span><input value={name} onChange={e => setName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label>Phone</label>
              <div className="input-field"><span>📱</span><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditing(false)} className="btn btn-ghost" style={{ padding: '10px 20px' }}>Cancel</button>
              <button onClick={saveProfile} className="btn btn-teal btn-full" style={{ padding: '10px 20px' }}>Save</button>
            </div>
          </div>
        ) : (
          <>
            {[
              { i: '📱', l: 'Phone', v: user.phone || 'Not set' },
              { i: '📍', l: 'City', v: user.city || 'Pattaya' },
              { i: '📅', l: 'Member since', v: new Date(user.createdAt).toLocaleDateString() },
            ].map(x => (
              <div key={x.l} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{x.i}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{x.l}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray)' }}>{x.v}</span>
                </div>
              </div>
            ))}
            <button onClick={() => setEditing(true)} className="btn btn-ghost btn-full" style={{ marginBottom: 10 }}>✏️ Edit Profile</button>
          </>
        )}
        <button onClick={logout} className="btn btn-danger btn-full" style={{ marginTop: 6 }}>Log Out</button>
      </div>
    );
  };

  const renderTab = () => {
    if (tab === 'category') return <CategoryTab />;
    if (tab === 'detail') return <DetailTab />;
    if (tab === 'bookings') return <BookingsTab />;
    if (tab === 'profile') return <ProfileTab />;
    return <HomeTab />;
  };

  return (
    <>
      <Head><title>Dashboard — PattayaPro</title></Head>
      <div className="app-shell">
        {/* Header */}
        <div className="app-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>
                <span style={{ color: 'var(--gold)' }}>Pattaya</span>Pro
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>👋 Hi, {user.name?.split(' ')[0]}</div>
            </div>
            <div onClick={() => { setTab('bookings'); loadBookings(); }} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}>📋</div>
          </div>
        </div>

        {/* Body */}
        <div className="app-body">{renderTab()}</div>

        {/* Tab Bar */}
        <div className="app-tabs">
          {[
            { id: 'home', ic: '🏠', lb: 'Home' },
            { id: 'bookings', ic: '📋', lb: 'Bookings' },
            { id: 'profile', ic: '👤', lb: 'Profile' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'bookings') loadBookings(); }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 20px', position: 'relative' }}>
              <span style={{ fontSize: 21 }}>{t.ic}</span>
              <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? 'var(--pri)' : 'var(--gray)' }}>{t.lb}</span>
              {tab === t.id && <div style={{ position: 'absolute', top: -1, width: 20, height: 3, background: 'var(--pri)', borderRadius: 2 }} />}
            </button>
          ))}
        </div>

        {/* Booking Modal */}
        {bookingModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 430, background: 'white', borderRadius: '22px 22px 0 0', padding: 24, maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Book Service</h2>
                <span onClick={() => setBookingModal(null)} style={{ fontSize: 22, cursor: 'pointer', color: 'var(--gray)' }}>✕</span>
              </div>
              <div className="card" style={{ background: 'rgba(12,124,124,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{bookingModal.icon || '✨'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{bookingModal.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{bookingModal.duration}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--pri-d)', fontSize: 18 }}>฿{bookingModal.price}</div>
                </div>
              </div>
              <div className="input-group">
                <label>Date *</label>
                <div className="input-field"><span>📅</span><input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
              </div>
              <div className="input-group">
                <label>Time Slot *</label>
                <div className="input-field">
                  <span>🕐</span>
                  <select value={bookTime} onChange={e => setBookTime(e.target.value)} style={{ border: 'none', flex: 1, fontSize: 14, background: 'transparent', fontFamily: 'var(--font)' }}>
                    <option value="">Select time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Address *</label>
                <div className="input-field"><span>📍</span><input placeholder="Your address in Pattaya" value={bookAddr} onChange={e => setBookAddr(e.target.value)} /></div>
              </div>
              <div className="input-group">
                <label>Notes</label>
                <div className="input-field"><span>📝</span><input placeholder="Special instructions (optional)" value={bookNotes} onChange={e => setBookNotes(e.target.value)} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginBottom: 8 }}>
                <span style={{ color: 'var(--gray)', fontSize: 13 }}>Service</span><span style={{ fontWeight: 700 }}>฿{bookingModal.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginBottom: 8, borderTop: '1px solid var(--gray-l)' }}>
                <span style={{ color: 'var(--gray)', fontSize: 13 }}>Platform Fee</span><span style={{ fontWeight: 700 }}>฿49</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid var(--dark)', marginBottom: 16 }}>
                <span style={{ fontWeight: 800 }}>Total</span><span style={{ fontWeight: 800, fontSize: 18, color: 'var(--pri-d)' }}>฿{bookingModal.price + 49}</span>
              </div>
              <button onClick={submitBooking} className="btn btn-teal btn-full" style={{ padding: 14, fontSize: 15 }}>
                {submitting ? 'Booking...' : 'Confirm Booking →'}
              </button>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: 380, background: 'white', borderRadius: 22, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>Rate Service ⭐</h2>
              <p style={{ fontSize: 13, color: 'var(--gray)', margin: '0 0 16px' }}>How was your experience?</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} onClick={() => setReviewRating(n)} style={{ fontSize: 32, cursor: 'pointer', opacity: n <= reviewRating ? 1 : 0.3 }}>⭐</span>
                ))}
              </div>
              <div className="input-group">
                <label>Comment (optional)</label>
                <div className="input-field"><input placeholder="Share your experience..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} /></div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setReviewId(null)} className="btn btn-ghost" style={{ padding: '10px 20px' }}>Cancel</button>
                <button onClick={submitReview} className="btn btn-teal btn-full" style={{ padding: '10px 20px' }}>Submit Review</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}