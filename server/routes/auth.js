const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { generateGeminiEmbedding } = require('../config/vector');

router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone, description } = req.body;
  const name = `${firstName} ${surname}`.trim();

  console.log('--- SIGNUP ATTEMPT ---');
  console.log('Email:', email);
  console.log('Name:', name);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name }
  });

  if (authError) {
    console.error('[AUTH ERROR]:', authError.status, authError.message);
    return res.status(400).json({ error: authError.message });
  }

  const userId = authData.user.id;
  console.log('[AUTH SUCCESS]: User ID created ->', userId);

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
    console.error('[PROFILE ERROR]:', profileError.code, profileError.message);
    
    if (profileError.code === '23505') {
        console.log('[INFO]: Profile already exists (possibly created by a DB trigger). Continuing...');
    } else {
        await supabase.auth.admin.deleteUser(userId);
        return res.status(400).json({ error: profileError.message });
    }
  } else {
    console.log('[PROFILE SUCCESS]: Profile row inserted.');
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
        console.log('[AI SUCCESS]: Embedding saved.');
      }
    } catch (aiErr) {
      console.error('[AI ERROR]:', aiErr.message);
      aiWarning = "Profile created, but matching service is temporarily unavailable.";
    }
  }

  const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    console.error('[LOGIN ERROR]:', loginError.message);
    return res.status(400).json({ error: loginError.message });
  }

  console.log('[SIGNUP COMPLETE]: Success.');
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
