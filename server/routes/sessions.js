const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/sessions/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, legends(name, village, photo_url, specialty, price_base)')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Session not found' });
  res.json(data);
});

// POST /api/sessions — create a new session slot
router.post('/', authMiddleware, async (req, res) => {
  const { legend_id, date, time_start, duration_minutes = 120, max_participants = 8 } = req.body;

  if (!legend_id || !date || !time_start) {
    return res.status(400).json({ error: 'legend_id, date, and time_start are required' });
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({ legend_id, date, time_start, duration_minutes, max_participants, status: 'open' })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, session: data });
});

// DELETE /api/sessions/:id — cancel session
router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase
    .from('sessions')
    .update({ status: 'cancelled' })
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
