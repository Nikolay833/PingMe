const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/match
 * Finds similar users based on vector embeddings of their descriptions.
 */
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Get current user's embedding
    const { data: userData, error: userError } = await supabase
      .from('AI_description')
      .select('embedding')
      .eq('user_id', userId)
      .single();

    if (userError || !userData?.embedding) {
      console.error('[MATCH] Could not find embedding for user:', userId, userError);
      return res.status(404).json({ error: 'Your profile description has not been processed yet. Please update your bio first.' });
    }

    // 2. Call the RPC function in Supabase to find matches
    const { data: matches, error: matchError } = await supabase.rpc('match_users', {
      query_embedding: userData.embedding,
      match_threshold: 0.5, // 50% similarity threshold (can be adjusted)
      match_count: 6,       // Return top 6 matches
      exclude_user_id: userId
    });

    if (matchError) {
      console.error('[MATCH] RPC match_users failed:', matchError);
      return res.status(500).json({ error: 'Failed to find matches.' });
    }

    res.json({ success: true, matches });
  } catch (error) {
    console.error('[MATCH] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
