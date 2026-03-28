const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { generateGeminiEmbedding } = require('../config/vector');

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    let { data: userData, error: userError } = await supabase
      .from('AI_description')
      .select('embedding')
      .eq('user_id', userId)
      .maybeSingle();

    let embedding = userData?.embedding;

    if (!embedding) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('bio')
        .eq('id', userId)
        .single();

      if (profile?.bio) {
        const newEmbedding = await generateGeminiEmbedding(profile.bio);

        if (newEmbedding) {
          embedding = newEmbedding;
          await supabase.from('AI_description').upsert({
            user_id: userId,
            embedding: newEmbedding
          }, { onConflict: 'user_id' });
        }
      }
    }

    if (!embedding) {
      return res.status(404).json({ error: 'Please update your bio in "My Profile" first.' });
    }

    const { data: matches, error: matchError } = await supabase.rpc('match_users', {
      query_embedding: embedding,
      match_threshold: 0.1,
      match_count: 6,
      exclude_user_id: userId
    });

    if (matchError) return res.status(500).json({ error: matchError.message });

    if (matches && matches.length > 0) {
      const userIds = matches.map(m => m.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, bio, location, points, avatar_url')
        .in('id', userIds);

      const profileMap = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p; });

      matches.forEach(m => {
        const p = profileMap[m.user_id] || {};
        m.bio        = p.bio        || '';
        m.location   = p.location   || '';
        m.points     = p.points     || 0;
        m.avatar_url = p.avatar_url || '';
      });
    }

    res.json({ success: true, matches: matches || [] });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
