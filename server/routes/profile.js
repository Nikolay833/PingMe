const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { summarizeDescription } = require('../config/summarizer');
const { generateGeminiEmbedding } = require('../config/vector');

// GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/profile
router.patch('/', authMiddleware, async (req, res) => {
  const { name, bio, location } = req.body;
  const userId = req.user.id;

  console.log('[PROFILE V5] Update request for user:', userId);

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, bio, location })
    .eq('id', userId);

  if (profileError) return res.status(400).json({ error: profileError.message });

  if (bio?.trim()) {
    console.log(`[PROFILE V5] Updating AI for user ${userId}...`);
    (async () => {
      try {
        const [summaryResult, embeddingResult] = await Promise.allSettled([
          summarizeDescription(bio, 10),
          generateGeminiEmbedding(bio)
        ]);

        const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
        const embedding = embeddingResult.status === 'fulfilled' ? embeddingResult.value : null;

        if (embedding) {
          await supabase.from('AI_description').upsert({
            user_id: userId,
            original_description: bio,
            summary: summary || bio.substring(0, 100),
            embedding: embedding
          }, { onConflict: 'user_id' });
          console.log('[PROFILE V5] AI updated.');
        }
      } catch (err) {
        console.error('[PROFILE V5] AI update failed:', err);
      }
    })();
  }

  res.json({ success: true });
});

// PATCH /api/profile/avatar
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
