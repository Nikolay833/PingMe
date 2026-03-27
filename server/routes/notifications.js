const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { randomUUID } = require('crypto');

// GET /api/notifications/all — all notifications (sent + received) for the logged-in user
router.get('/all', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('notifications')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.notifications || []);
});

// GET /api/notifications/connections — accepted connections
router.get('/connections', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('connections')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.connections || []);
});

// POST /api/notifications — send a connect request
router.post('/', authMiddleware, async (req, res) => {
  const { recipient_id } = req.body;
  const sender_id = req.user.id;
  const sender_name = req.user.name || 'Someone';

  if (!recipient_id) return res.status(400).json({ error: 'recipient_id required' });
  if (recipient_id === sender_id) return res.status(400).json({ error: 'Cannot connect with yourself' });

  // Load both profiles
  const [{ data: recipientData, error: rErr }, { data: senderData, error: sErr }] = await Promise.all([
    supabase.from('profiles').select('notifications, name').eq('id', recipient_id).single(),
    supabase.from('profiles').select('notifications').eq('id', sender_id).single()
  ]);

  if (rErr || sErr) return res.status(404).json({ error: 'User not found' });

  const recipientNotifs = recipientData.notifications || [];
  const senderNotifs    = senderData.notifications || [];

  // Prevent duplicate pending
  const duplicate = recipientNotifs.find(n => n.sender_id === sender_id && n.status === 'pending');
  if (duplicate) return res.status(409).json({ error: 'Request already sent' });

  const id = randomUUID();
  const created_at = new Date().toISOString();

  // Add incoming entry to recipient
  recipientNotifs.push({ id, sender_id, sender_name, type: 'received', status: 'pending', created_at });

  // Add outgoing entry to sender
  senderNotifs.push({ id, recipient_id, recipient_name: recipientData.name || 'Someone', type: 'sent', status: 'pending', created_at });

  await Promise.all([
    supabase.from('profiles').update({ notifications: recipientNotifs }).eq('id', recipient_id),
    supabase.from('profiles').update({ notifications: senderNotifs }).eq('id', sender_id)
  ]);

  res.json({ success: true });
});

// PATCH /api/notifications/:id — accept or decline
router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'status must be accepted or declined' });
  }

  const recipientId = req.user.id;
  const notifId = req.params.id;

  // Load recipient's profile
  const { data: recipientData, error } = await supabase
    .from('profiles')
    .select('notifications, connections, name')
    .eq('id', recipientId)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const recipientNotifs = recipientData.notifications || [];
  const notif = recipientNotifs.find(n => n.id === notifId);
  if (!notif) return res.status(404).json({ error: 'Notification not found' });

  const senderId = notif.sender_id;

  // Update status in recipient's notifications
  const updatedRecipientNotifs = recipientNotifs.map(n =>
    n.id === notifId ? { ...n, status } : n
  );

  // Load sender's profile to update their sent request status
  const { data: senderData } = await supabase
    .from('profiles')
    .select('notifications, connections')
    .eq('id', senderId)
    .single();

  const updatedSenderNotifs = (senderData?.notifications || []).map(n =>
    n.id === notifId ? { ...n, status } : n
  );

  const updates = [
    supabase.from('profiles').update({ notifications: updatedRecipientNotifs }).eq('id', recipientId),
    supabase.from('profiles').update({ notifications: updatedSenderNotifs }).eq('id', senderId)
  ];

  // If accepted — add each other to connections
  if (status === 'accepted') {
    const now = new Date().toISOString();

    const recipientConnections = [...(recipientData.connections || []),
      { user_id: senderId, name: notif.sender_name, connected_at: now }];

    const senderConnections = [...(senderData?.connections || []),
      { user_id: recipientId, name: recipientData.name || 'Someone', connected_at: now }];

    updates.push(
      supabase.from('profiles').update({ connections: recipientConnections }).eq('id', recipientId),
      supabase.from('profiles').update({ connections: senderConnections }).eq('id', senderId)
    );
  }

  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed) {
    console.error('Supabase update error:', failed.error);
    return res.status(500).json({ error: failed.error.message });
  }
  res.json({ success: true });
});

module.exports = router;
