const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { generateGeminiEmbedding } = require('../config/vector');

/**
 * GET /api/match
 */
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  console.log('[MATCH V5] Match request for user:', userId);

  try {
    // 1. Get embedding (Using simple table name, library handles quoting)
    let { data: userData, error: userError } = await supabase
      .from('AI_description')
      .select('embedding')
      .eq('user_id', userId)
      .maybeSingle();

    let embedding = userData?.embedding;

    // 2. Fallback to bio generation
    if (!embedding) {
      console.log('[MATCH V5] No embedding found. checking profiles bio...');
      const { data: profile } = await supabase
        .from('profiles')
        .select('bio')
        .eq('id', userId)
        .single();

      if (profile?.bio) {
        console.log('[MATCH V5] Generating on-the-fly...');
        const newEmbedding = await generateGeminiEmbedding(profile.bio);

        if (newEmbedding) {
          embedding = newEmbedding;
          await supabase.from('AI_description').upsert({
            user_id: userId,
            embedding: newEmbedding
          }, { onConflict: 'user_id' });
          console.log('[MATCH V5] Embedding generated and saved.');
        }
      }
    }

    if (!embedding) {
      return res.status(404).json({ error: 'Please update your bio in "My Profile" first.' });
    }

    // 3. Search
    const { data: matches, error: matchError } = await supabase.rpc('match_users', {
      query_embedding: embedding,
      match_threshold: 0.1,
      match_count: 6,
      exclude_user_id: userId
    });

    if (matchError) return res.status(500).json({ error: matchError.message });

    res.json({ success: true, matches: matches || [] });

  } catch (error) {
    console.error('[MATCH V5] Crash:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
