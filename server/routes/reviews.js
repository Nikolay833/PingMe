const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { askClaude } = require('../config/anthropic');
const { authMiddleware } = require('../middleware/auth');

// POST /api/reviews
router.post('/', authMiddleware, async (req, res) => {
  const { booking_id, rating, text } = req.body;

  if (!booking_id || !rating) {
    return res.status(400).json({ error: 'booking_id and rating are required' });
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert({ booking_id, reviewer_id: req.user.id, rating, text })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Run AI analysis in background — don't make user wait
  if (text) analyzeSentiment(review.id, text);

  res.json({ success: true, review_id: review.id });
});

async function analyzeSentiment(review_id, text) {
  try {
    const prompt = `Analyze this review of a local cultural experience in Bulgaria. Rate it on 5 dimensions.

Review text: "${text}"

Respond ONLY with this exact JSON:
{
  "authenticity": <1-10>,
  "uniqueness": <1-10>,
  "educational_value": <1-10>,
  "emotional_impact": <1-10>,
  "would_recommend": <1-10>,
  "key_themes": ["<theme1>", "<theme2>", "<theme3>"],
  "one_line_summary": "<single sentence that captures the essence of this review>"
}`;

    const aiResponse = await askClaude(prompt, 300);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const sentiment = JSON.parse(jsonMatch[0]);

    await supabase.from('reviews').update({ ai_sentiment: sentiment }).eq('id', review_id);
  } catch (err) {
    console.error('Sentiment analysis failed for review', review_id, err.message);
  }
}

module.exports = router;
