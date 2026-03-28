const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { generateGeminiEmbedding } = require('../config/vector');

router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ...data, email: req.user.email });
});

router.get('/:userId', async (req, res) => {
  const [{ data, error }, { data: authUser }] = await Promise.all([
    supabase.from('profiles').select('name, bio, location, avatar_url, phone, points').eq('id', req.params.userId).maybeSingle(),
    supabase.auth.admin.getUserById(req.params.userId)
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json({ ...data, email: authUser?.user?.email || '' });
});

router.patch('/', authMiddleware, async (req, res) => {
  const { name, bio, location } = req.body;
  const userId = req.user.id;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, bio, location })
    .eq('id', userId);

  if (profileError) return res.status(400).json({ error: profileError.message });

  if (bio?.trim()) {
    (async () => {
      try {
        const embedding = await generateGeminiEmbedding(bio);

        if (embedding) {
          await supabase.from('AI_description').upsert({
            user_id: userId,
            embedding: embedding
          }, { onConflict: 'user_id' });
        }
      } catch (err) {
      }
    })();
  }

  res.json({ success: true });
});

router.patch('/avatar', authMiddleware, async (req, res) => {
  const { avatar_url } = req.body;
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url })
    .eq('id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

router.post('/:userId/rate', authMiddleware, async (req, res) => {
  const { stars } = req.body;
  const raterId   = req.user.id;
  const targetId  = req.params.userId;

  if (raterId === targetId) return res.status(400).json({ error: 'Cannot rate yourself' });
  if (!Number.isInteger(stars) || stars < 0 || stars > 5)
    return res.status(400).json({ error: 'Stars must be an integer 0–5' });

  const { data: rater } = await supabase.from('profiles').select('connections').eq('id', raterId).single();
  const connected = (rater?.connections || []).some(c => c.user_id === targetId);
  if (!connected) return res.status(403).json({ error: 'Must be connected to rate' });

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
