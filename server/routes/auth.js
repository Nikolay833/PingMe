const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { generateGeminiEmbedding } = require('../config/vector');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone, description } = req.body;
  const name = `${firstName} ${surname}`.trim();

  console.log('--- SIGNUP ATTEMPT ---');
  console.log('Email:', email);
  console.log('Name:', name);

  // 1. Create the user in Supabase Auth
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

  // 2. Create the profile
  // Note: Check if you have a database trigger in Supabase that already handles this!
  // If you have a trigger, this manual insert might cause a "duplicate key" error.
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
    
    // If it's a duplicate key error on 'id', it means a trigger already created the profile
    if (profileError.code === '23505') { 
        console.log('[INFO]: Profile already exists (possibly created by a DB trigger). Continuing...');
    } else {
        // For other errors, cleanup the auth user so they can try again
        await supabase.auth.admin.deleteUser(userId);
        return res.status(400).json({ error: profileError.message });
    }
  } else {
    console.log('[PROFILE SUCCESS]: Profile row inserted.');
  }

  // 3. Generate Embeddings
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

  // 4. Sign in to get a session token
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
