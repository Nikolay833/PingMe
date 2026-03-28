const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { generateGeminiEmbedding } = require('../config/vector');

router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone, description } = req.body;
  const name = `${firstName} ${surname}`.trim();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name }
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role: 'traveler',
    name,
    country,
    city,
    phone,
    bio: description || ''
  });

  if (profileError) {
    if (profileError.code !== '23505') {
      await supabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }
  }

  let aiWarning = null;
  if (description?.trim()) {
    try {
      const embedding = await generateGeminiEmbedding(description);
      if (embedding) {
        await supabase.from('AI_description').insert({
          user_id: userId,
          embedding: embedding
        });
      }
    } catch (aiErr) {
      aiWarning = "Profile created, but matching service is temporarily unavailable.";
    }
  }

  const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    return res.status(400).json({ error: loginError.message });
  }

  res.json({
    success: true,
    token: sessionData.session.access_token,
    user: { id: userId, email, name },
    warning: aiWarning
  });
});

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
