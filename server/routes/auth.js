const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name, role = 'traveler' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password and name are required' });
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) return res.status(400).json({ error: authError.message });

  await supabase.from('profiles').insert({ id: authData.user.id, role, name });

  if (role === 'traveler') {
    await supabase.from('travelers').insert({ id: authData.user.id });
  }

  res.json({ success: true, message: 'Account created successfully' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: 'Invalid email or password' });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', data.user.id)
    .single();

  res.json({
    success: true,
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: profile?.name,
      role: profile?.role
    }
  });
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, async (req, res) => {
  await supabase.auth.signOut();
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  });
});

// PATCH /api/auth/update-traveler — save matchmaking profile
router.patch('/update-traveler', authMiddleware, async (req, res) => {
  const { interests, travel_style, looking_for } = req.body;

  const { error } = await supabase
    .from('travelers')
    .upsert({ id: req.user.id, interests, travel_style, looking_for });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// POST /api/signup — used by login.html register form
router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password } = req.body;
  const name = `${firstName} ${surname}`.trim();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) return res.status(400).json({ error: authError.message });

  await supabase.from('profiles').insert({ id: authData.user.id, role: 'traveler', name });
  await supabase.from('travelers').insert({ id: authData.user.id });

  res.json({ success: true, message: 'Account created! Redirecting...' });
});

module.exports = router;
