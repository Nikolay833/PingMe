const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { summarizeDescription } = require('../config/summarizer');
const { generateGeminiEmbedding } = require('../config/vector');

// POST /api/auth/signup — register form in login.html
router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone, description } = req.body;
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

  // Handle AI description and embeddings
  if (description) {
    console.log('Starting AI processing for description...');
    try {
      const [summary, embedding] = await Promise.all([
        summarizeDescription(description, 10),
        generateGeminiEmbedding(description)
      ]);

      console.log('AI processing complete. Summary:', summary, 'Embedding length:', embedding.length);

      const { data: aiData, error: aiInsertError } = await supabase.from('AI_description').insert({
        user_id: authData.user.id,
        original_description: description,
        summary: summary,
        embedding: embedding
      });

      if (aiInsertError) {
        console.error('Supabase AI_description insert error:', aiInsertError.message);
      } else {
        console.log('Successfully saved to AI_description');
      }
    } catch (aiErr) {
      console.error('AI Processing or DB Insert failed:', aiErr.message);
      // We don't block registration if AI fails
    }
  }

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
