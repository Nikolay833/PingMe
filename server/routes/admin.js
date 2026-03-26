const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// GET /api/admin/pending — legends awaiting approval
router.get('/pending', authMiddleware, adminOnly, async (req, res) => {
  const { data, error } = await supabase
    .from('legends')
    .select('*')
    .eq('is_verified', false)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/admin/legends/:id/approve
router.patch('/legends/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  const { error } = await supabase
    .from('legends')
    .update({ is_verified: true })
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// PATCH /api/admin/legends/:id/reject
router.patch('/legends/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  const { reason = 'No reason given' } = req.body;

  const { error } = await supabase
    .from('legends')
    .update({ is_verified: false })
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// GET /api/admin/stats
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  const [
    { count: total_users },
    { count: total_legends },
    { count: total_bookings },
    { count: completed_bookings }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('legends').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
  ]);

  res.json({ total_users, total_legends, total_bookings, completed_bookings });
});

module.exports = router;
