const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/legends — all verified legends (for map)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('legends')
    .select('id, name, village, lat, lng, specialty, extinction_risk, photo_url, age, price_base')
    .eq('is_verified', true);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/legends/nearby?lat=X&lng=Y&radius=50
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 50 } = req.query;

  const { data, error } = await supabase
    .from('legends')
    .select('id, name, village, lat, lng, specialty, extinction_risk, photo_url, age, price_base')
    .eq('is_verified', true);

  if (error) return res.status(500).json({ error: error.message });

  const filtered = data.filter(legend => {
    if (!legend.lat || !legend.lng) return false;
    const R = 6371;
    const dLat = (legend.lat - lat) * Math.PI / 180;
    const dLng  = (legend.lng - lng)  * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(legend.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) <= radius;
  });

  res.json(filtered);
});

// GET /api/legends/:id — single legend
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('legends')
    .select('*')
    .eq('id', req.params.id)
    .eq('is_verified', true)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Legend not found' });
  res.json(data);
});

// GET /api/legends/:id/sessions — open future sessions
router.get('/:id/sessions', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('legend_id', req.params.id)
    .in('status', ['open', 'full'])
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/legends/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  // Get reviews via bookings → sessions → legend
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id')
    .eq('legend_id', req.params.id);

  if (!sessions?.length) return res.json([]);

  const sessionIds = sessions.map(s => s.id);

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id')
    .in('session_id', sessionIds);

  if (!bookings?.length) return res.json([]);

  const bookingIds = bookings.map(b => b.id);

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, text, ai_sentiment, created_at, profiles(name, avatar_url)')
    .in('booking_id', bookingIds)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/legends/:id/knowledge — public knowledge docs
router.get('/:id/knowledge', async (req, res) => {
  const { data, error } = await supabase
    .from('knowledge_docs')
    .select('*')
    .eq('legend_id', req.params.id)
    .eq('is_public', true);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/legends/:id/dashboard — legend's own stats (protected)
router.get('/:id/dashboard', authMiddleware, async (req, res) => {
  const legendId = req.params.id;

  const [{ data: legend }, { data: sessions }] = await Promise.all([
    supabase.from('legends').select('*').eq('id', legendId).single(),
    supabase.from('sessions').select('id').eq('legend_id', legendId)
  ]);

  let bookings = [];
  if (sessions?.length) {
    const sessionIds = sessions.map(s => s.id);
    const { data } = await supabase
      .from('bookings')
      .select('*, sessions(date, time_start), profiles(name)')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: false });
    bookings = data || [];
  }

  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.legend_payout || 0), 0);

  res.json({ legend, bookings, totalEarnings });
});

module.exports = router;
