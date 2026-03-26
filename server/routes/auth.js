const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/auth/signup — register form in login.html
router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone } = req.body;
  const name = `${firstName} ${surname}`.trim();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) return res.status(400).json({ error: authError.message });

  await supabase.from('profiles').insert({
    id: authData.user.id,
    role: 'traveler',
    name,
    country,
    city,
    phone
  });

  // Auto-login so we get a token back
  const { data: session, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) return res.status(400).json({ error: loginError.message });

  res.json({
    success: true,
    token: session.session.access_token,
    user: { id: authData.user.id, email, name }
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Invalid email or password' });

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', data.user.id)
    .single();

  res.json({
    success: true,
    token: data.session.access_token,
    user: { id: data.user.id, email: data.user.email, name: profile?.name, role: profile?.role }
  });
});

module.exports = router;
