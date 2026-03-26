const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/profile — load current user's profile
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/profile — save changes
router.patch('/', authMiddleware, async (req, res) => {
  const { name, bio, location } = req.body;

  const { error } = await supabase
    .from('profiles')
    .update({ name, bio, location })
    .eq('id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// PATCH /api/profile/avatar — update avatar url after upload
router.patch('/avatar', authMiddleware, async (req, res) => {
  const { avatar_url } = req.body;

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url })
    .eq('id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
