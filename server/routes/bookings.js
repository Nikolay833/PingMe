const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// POST /api/bookings — create a booking
router.post('/', authMiddleware, async (req, res) => {
  const { session_id, participants = 1 } = req.body;
  const traveler_id = req.user.id;

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*, legends(price_base)')
    .eq('id', session_id)
    .single();

  if (sessionError || !session) return res.status(404).json({ error: 'Session not found' });
  if (session.status !== 'open') return res.status(409).json({ error: 'This session is no longer available' });

  const total_price  = session.legends.price_base * participants;
  const platform_fee = total_price * 0.20;
  const legend_payout = total_price * 0.80;
  const qr_token = crypto.randomUUID();
  const locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await supabase
    .from('sessions')
    .update({ status: 'locked', locked_until })
    .eq('id', session_id);

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({ session_id, traveler_id, participants, total_price, platform_fee, legend_payout, status: 'pending', qr_token })
    .select()
    .single();

  if (bookingError) {
    await supabase.from('sessions').update({ status: 'open', locked_until: null }).eq('id', session_id);
    return res.status(400).json({ error: bookingError.message });
  }

  res.json({ success: true, booking_id: booking.id, qr_token, total_price });
});

// GET /api/bookings/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, sessions(date, time_start, legends(name, village, photo_url))')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Booking not found' });
  res.json(data);
});

// GET /api/bookings/traveler/:id — all bookings for a traveler
router.get('/traveler/:traveler_id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, sessions(date, time_start, legends(name, village, photo_url, specialty))')
    .eq('traveler_id', req.params.traveler_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/bookings/:id/cancel
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  const { data: booking } = await supabase
    .from('bookings')
    .select('session_id, status')
    .eq('id', req.params.id)
    .single();

  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status === 'completed') return res.status(400).json({ error: 'Cannot cancel a completed booking' });

  await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', req.params.id);
  await supabase.from('sessions').update({ status: 'open', locked_until: null }).eq('id', booking.session_id);

  res.json({ success: true });
});

// POST /api/bookings/:id/checkin — legend scans QR to confirm arrival
router.post('/:id/checkin', authMiddleware, async (req, res) => {
  const { qr_token } = req.body;

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, session_id, status')
    .eq('id', req.params.id)
    .eq('qr_token', qr_token)
    .single();

  if (!booking) return res.status(404).json({ error: 'Invalid QR code' });
  if (booking.status !== 'confirmed') return res.status(400).json({ error: 'Booking must be confirmed before check-in' });

  await supabase.from('bookings').update({ status: 'completed' }).eq('id', booking.id);
  await supabase.from('sessions').update({ status: 'completed' }).eq('id', booking.session_id);

  res.json({ success: true });
});

// PATCH /api/bookings/:id/confirm — legend confirms booking
router.patch('/:id/confirm', authMiddleware, async (req, res) => {
  const { data: booking } = await supabase
    .from('bookings').select('session_id').eq('id', req.params.id).single();

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', req.params.id);
  await supabase.from('sessions').update({ status: 'full' }).eq('id', booking.session_id);

  res.json({ success: true });
});

// PATCH /api/bookings/:id/decline — legend declines booking
router.patch('/:id/decline', authMiddleware, async (req, res) => {
  const { data: booking } = await supabase
    .from('bookings').select('session_id').eq('id', req.params.id).single();

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', req.params.id);
  await supabase.from('sessions').update({ status: 'open', locked_until: null }).eq('id', booking.session_id);

  res.json({ success: true });
});

module.exports = router;
