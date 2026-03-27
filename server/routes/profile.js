const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { generateGeminiEmbedding } = require('../config/vector');

// GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ...data, email: req.user.email });
});

// GET /api/profile/:userId — public profile view
router.get('/:userId', async (req, res) => {
  console.log('[PROFILE] Public fetch for userId:', req.params.userId);
  const [{ data, error }, { data: authUser }] = await Promise.all([
    supabase.from('profiles').select('name, bio, location, avatar_url, phone, points').eq('id', req.params.userId).maybeSingle(),
    supabase.auth.admin.getUserById(req.params.userId)
  ]);

  if (error) {
    console.error('[PROFILE] Supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    console.warn('[PROFILE] No profile found for:', req.params.userId);
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json({ ...data, email: authUser?.user?.email || '' });
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
        const embedding = await generateGeminiEmbedding(bio);

        if (embedding) {
          await supabase.from('AI_description').upsert({
            user_id: userId,
            embedding: embedding
          }, { onConflict: 'user_id' });
          console.log('[PROFILE V5] AI updated (embedding only).');
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

// POST /api/profile/:userId/rate — rate a connected user (0-5 stars)
router.post('/:userId/rate', authMiddleware, async (req, res) => {
  const { stars } = req.body;
  const raterId   = req.user.id;
  const targetId  = req.params.userId;

  if (raterId === targetId) return res.status(400).json({ error: 'Cannot rate yourself' });
  if (!Number.isInteger(stars) || stars < 0 || stars > 5)
    return res.status(400).json({ error: 'Stars must be an integer 0–5' });

  // Must be connected
  const { data: rater } = await supabase.from('profiles').select('connections').eq('id', raterId).single();
  const connected = (rater?.connections || []).some(c => c.user_id === targetId);
  if (!connected) return res.status(403).json({ error: 'Must be connected to rate' });

  // Load target profile
  const { data: target, error: tErr } = await supabase
    .from('profiles').select('points, ratings').eq('id', targetId).single();
  if (tErr) return res.status(500).json({ error: tErr.message });

  const ratings      = target?.ratings || [];
  const existing     = ratings.find(r => r.rater_id === raterId);
  const pointDelta   = existing ? stars - existing.stars : stars;
  const updatedRatings = existing
    ? ratings.map(r => r.rater_id === raterId ? { ...r, stars, updated_at: new Date().toISOString() } : r)
    : [...ratings, { rater_id: raterId, stars, created_at: new Date().toISOString() }];

  const newPoints = Math.max(0, (target?.points || 0) + pointDelta);

  const { error } = await supabase
    .from('profiles')
    .update({ points: newPoints, ratings: updatedRatings })
    .eq('id', targetId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, points: newPoints });
});

module.exports = router;
