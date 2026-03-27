const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { randomUUID } = require('crypto');

// GET /api/notifications — get pending notifications for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('notifications')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const pending = (data.notifications || []).filter(n => n.status === 'pending');
  res.json(pending);
});

// POST /api/notifications — send a connect request to recipient
router.post('/', authMiddleware, async (req, res) => {
  const { recipient_id } = req.body;
  const sender_id = req.user.id;
  const sender_name = req.user.name || 'Someone';

  if (!recipient_id) return res.status(400).json({ error: 'recipient_id required' });
  if (recipient_id === sender_id) return res.status(400).json({ error: 'Cannot connect with yourself' });

  // Load recipient's current notifications
  const { data, error } = await supabase
    .from('profiles')
    .select('notifications')
    .eq('id', recipient_id)
    .single();

  if (error) return res.status(404).json({ error: 'Recipient not found' });

  const notifications = data.notifications || [];

  // Prevent duplicate pending requests
  const duplicate = notifications.find(n => n.sender_id === sender_id && n.status === 'pending');
  if (duplicate) return res.status(409).json({ error: 'Request already sent' });

  notifications.push({
    id: randomUUID(),
    sender_id,
    sender_name,
    status: 'pending',
    created_at: new Date().toISOString()
  });

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ notifications })
    .eq('id', recipient_id);

  if (updateError) return res.status(500).json({ error: updateError.message });
  res.json({ success: true });
});

// PATCH /api/notifications/:id — accept or decline
router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'status must be accepted or declined' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('notifications')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const notifications = (data.notifications || []).map(n =>
    n.id === req.params.id ? { ...n, status } : n
  );

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ notifications })
    .eq('id', req.user.id);

  if (updateError) return res.status(500).json({ error: updateError.message });
  res.json({ success: true });
});

module.exports = router;
