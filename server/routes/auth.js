const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { generateGeminiEmbedding } = require('../config/vector');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone, description } = req.body;
  const name = `${firstName} ${surname}`.trim();

  console.log('[SIGNUP V5] Starting registration for:', email);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) return res.status(400).json({ error: authError.message });

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role: 'traveler',
    name,
    country,
    city,
    phone,
    bio: description
  });

  if (profileError) return res.status(400).json({ error: profileError.message });

  let aiWarning = null;
  if (description?.trim()) {
    console.log(`[AI V5] Processing user ${userId}...`);
    try {
      // Only generating the embedding now, summary is no longer stored here
      const embedding = await generateGeminiEmbedding(description);

      if (embedding) {
        const { error: aiInsertError } = await supabase.from('AI_description').insert({
          user_id: userId,
          embedding: embedding
        });
        if (aiInsertError) aiWarning = aiInsertError.message;
      }
    } catch (aiErr) {
      aiWarning = aiErr.message;
    }
  }

  const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) return res.status(400).json({ error: loginError.message });

  res.json({
    success: true,
    token: sessionData.session.access_token,
    user: { id: userId, email, name },
    warning: aiWarning
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
