const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { generateGeminiEmbedding } = require('../config/vector');

// GET /api/profile — load current user's profile
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/profile — save changes
router.patch('/', authMiddleware, async (req, res) => {
  const { name, bio, location } = req.body;
  const userId = req.user.id;

  // Update main profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, bio, location })
    .eq('id', userId);

  if (profileError) return res.status(400).json({ error: profileError.message });

  // Update AI description if bio changed
  if (bio && bio.trim()) {
    (async () => {
      try {
        const embedding = await generateGeminiEmbedding(bio);
        const summary = bio.length <= 100 ? bio : bio.slice(0, 97) + '...';

        const { error: aiError } = await supabase
          .from('AI_description')
          .upsert(
            { user_id: userId, original_description: bio, summary, embedding },
            { onConflict: 'user_id' }
          );

        if (aiError) console.error('[PROFILE] AI_description upsert error:', aiError.message);
        else console.log('[PROFILE] AI_description updated successfully');
      } catch (err) {
        console.error('[PROFILE] AI update failed:', err.message);
      }
    })();
  }

  res.json({ success: true });
});

// PATCH /api/profile/avatar — update avatar url after upload
router.patch('/avatar', authMiddleware, async (req, res) => {
  const { avatar_url } = req.body;

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url })
    .eq('id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
