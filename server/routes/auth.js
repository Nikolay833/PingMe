const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { summarizeDescription } = require('../config/summarizer');
const { generateGeminiEmbedding } = require('../config/vector');

// POST /api/auth/signup — register form in login.html
router.post('/signup', async (req, res) => {
  const { firstName, surname, email, password, country, city, phone, description } = req.body;
  const name = `${firstName} ${surname}`.trim();

  console.log('[SIGNUP] Starting registration for:', email);

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    console.error('[SIGNUP] Registration failed at auth creation:', authError.message);
    return res.status(400).json({ error: authError.message });
  }

  const userId = authData.user.id;
  console.log('[SIGNUP] Auth user created with ID:', userId);

  // Insert profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role: 'traveler',
    name,
    country,
    city,
    phone,
    bio: description // Map description to bio for the profile
  });

  if (profileError) {
    console.error('[SIGNUP] Profile creation failed:', profileError.message);
    return res.status(400).json({ error: profileError.message });
  }

  // Handle AI description and embeddings
  let aiWarning = null;
  if (description && description.trim().length > 0) {
    console.log(`[AI] Processing description for user ${userId}...`);
    try {
      // 1. Summarize description (OpenRouter)
      // 2. Generate embedding (@google/genai)
      const [summaryResult, embeddingResult] = await Promise.allSettled([
        summarizeDescription(description, 10),
        generateGeminiEmbedding(description)
      ]);

      const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
      const embedding = embeddingResult.status === 'fulfilled' ? embeddingResult.value : null;

      if (summaryResult.status === 'rejected') {
        console.error('[AI] Summarization failed:', summaryResult.reason);
        aiWarning = `Summarization failed: ${summaryResult.reason.message || summaryResult.reason}`;
      }
      if (embeddingResult.status === 'rejected') {
        console.error('[AI] Embedding generation failed:', embeddingResult.reason);
        aiWarning = (aiWarning ? aiWarning + '; ' : '') + `Embedding failed: ${embeddingResult.reason.message || embeddingResult.reason}`;
      }

      // We NEED the embedding for the AI_description table.
      if (embedding) {
        console.log(`[AI] Writing to "AI_description" for user ${userId}...`);
        
        const { error: aiInsertError } = await supabase.from('AI_description').insert({
          user_id: userId,
          original_description: description,
          summary: summary || description.substring(0, 100),
          embedding: embedding
        });

        if (aiInsertError) {
          console.error('[AI] Supabase AI_description insert error:', aiInsertError.message);
          aiWarning = (aiWarning ? aiWarning + '; ' : '') + `DB Insert failed: ${aiInsertError.message}`;
        } else {
          console.log('[AI] Successfully saved to AI_description');
        }
      } else {
        console.warn('[AI] Skipping AI_description storage: No embedding generated.');
      }
    } catch (aiErr) {
      console.error('[AI] Unexpected overall AI Processing error:', aiErr);
      aiWarning = (aiWarning ? aiWarning + '; ' : '') + `Unexpected AI error: ${aiErr.message}`;
    }
  } else {
    console.log('[AI] Skipping: No description provided by user.');
  }

  // Auto-login so we get a token back
  const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    console.error('[SIGNUP] Login after signup failed:', loginError.message);
    return res.status(400).json({ error: loginError.message });
  }

  console.log('[SIGNUP] Registration and processing complete for:', email);

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
