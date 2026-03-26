const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const supabase = require('../config/supabase');
const { askClaude } = require('../config/anthropic');
const { authMiddleware } = require('../middleware/auth');

// POST /api/ai/match — semantic matchmaking
router.post('/match', authMiddleware, async (req, res) => {
  const { traveler_id } = req.body;

  const { data: traveler } = await supabase
    .from('travelers')
    .select('*, profiles(name)')
    .eq('id', traveler_id)
    .single();

  if (!traveler) return res.status(404).json({ error: 'Traveler profile not found. Please fill in your profile first.' });

  const { data: legends } = await supabase
    .from('legends')
    .select('id, name, village, specialty, story, age')
    .eq('is_verified', true);

  if (!legends?.length) return res.status(404).json({ error: 'No legends available yet' });

  const legendsList = legends.map(l =>
    `LEGEND ID ${l.id}:\nName: ${l.name}\nVillage: ${l.village}\nAge: ${l.age}\nSpecialty: ${l.specialty}\nStory: ${l.story}\n---`
  ).join('\n');

  const prompt = `You are a matchmaking system for PingMe — a platform connecting travelers with local knowledge carriers in Bulgarian villages. These are real elderly people with irreplaceable knowledge.

TRAVELER PROFILE:
Name: ${traveler.profiles.name}
Interests: ${traveler.interests || 'Not specified'}
Travel style: ${traveler.travel_style || 'Not specified'}
What they are looking for: ${traveler.looking_for || 'Not specified'}

AVAILABLE LEGENDS:
${legendsList}

Read the traveler profile carefully. Compare it against every legend description. Choose the ONE best semantic match — not keyword matching, but which person this traveler would genuinely connect with.

Respond with ONLY this JSON, no other text:
{
  "legend_id": <the ID number of your chosen legend>,
  "reason": "<2-3 warm, personal sentences explaining why exactly these two should meet>"
}`;

  try {
    const aiResponse = await askClaude(prompt, 400);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);

    const { data: matchedLegend } = await supabase
      .from('legends').select('*').eq('id', result.legend_id).single();

    res.json({ success: true, match: matchedLegend, reason: result.reason });
  } catch (err) {
    res.status(500).json({ error: 'Matchmaking failed: ' + err.message });
  }
});

// POST /api/ai/debrief — next interview question
router.post('/debrief', authMiddleware, async (req, res) => {
  const { conversation_history = [], latest_answer, specialty } = req.body;

  const historyText = conversation_history
    .map(turn => `Question: ${turn.question}\nAnswer: ${turn.answer}`)
    .join('\n\n');

  const prompt = `You are interviewing an elderly Bulgarian person to extract their tacit knowledge — the things they know in their hands and feelings, not just their words.

Their specialty: ${specialty}

Previous conversation:
${historyText}

Their latest answer: "${latest_answer}"

Your task: Generate ONE follow-up question.
Rules:
- Use extremely simple language (they may have limited education)
- Be warm, patient, and genuinely curious
- If they mentioned a physical feeling or intuition, ask them to describe it more specifically
- If they mentioned a step in a process, ask what happens if they skip it
- Never ask multiple questions at once
- Maximum 2 sentences
- Write in Bulgarian

Respond with only the question text, nothing else.`;

  try {
    const nextQuestion = await askClaude(prompt, 200);
    res.json({ success: true, next_question: nextQuestion });
  } catch (err) {
    res.status(500).json({ error: 'Debrief failed: ' + err.message });
  }
});

// POST /api/ai/debrief/finalize — generate knowledge document
router.post('/debrief/finalize', authMiddleware, async (req, res) => {
  const { legend_id, full_conversation, specialty } = req.body;

  const conversationText = full_conversation
    .filter(t => t.answer)
    .map(turn => `Q: ${turn.question}\nA: ${turn.answer}`)
    .join('\n\n');

  const prompt = `Based on this interview with a Bulgarian knowledge carrier, create a structured knowledge document.

Their specialty: ${specialty}

Full interview:
${conversationText}

Create a clear, well-organized document that captures:
1. The core technique or knowledge
2. Key steps in order
3. The subtle things only they know (the feelings, timing, intuitions)
4. History and context
5. Any warnings or common mistakes

Write in English. Make it readable and engaging. Format with clear headings using markdown.`;

  try {
    const document = await askClaude(prompt, 1000);

    await supabase.from('knowledge_docs').insert({
      legend_id,
      title: `The Knowledge of ${specialty}`,
      content: document,
      is_public: true
    });

    res.json({ success: true, document });
  } catch (err) {
    res.status(500).json({ error: 'Finalize failed: ' + err.message });
  }
});

// POST /api/ai/echo — answer as a legend (from their recorded knowledge)
router.post('/echo', authMiddleware, async (req, res) => {
  const { legend_id, question } = req.body;

  const { data: legend } = await supabase
    .from('legends')
    .select('name, specialty, story')
    .eq('id', legend_id)
    .single();

  const { data: transcripts } = await supabase
    .from('transcripts')
    .select('raw_text')
    .eq('legend_id', legend_id)
    .eq('consent_given', true);

  const transcriptText = transcripts?.map(t => t.raw_text).join('\n\n') || '';

  const prompt = `You are an AI echo of ${legend.name}, a Bulgarian knowledge carrier known for: ${legend.specialty}.

Everything we know about them:
${legend.story}

Their recorded words and teachings:
${transcriptText}

A visitor is asking: "${question}"

Answer as ${legend.name} would have answered — warm, wise, specific to their knowledge. Keep it under 150 words. If the question is outside their expertise, say so in their voice.`;

  try {
    const answer = await askClaude(prompt, 300);
    res.json({ success: true, answer });
  } catch (err) {
    res.status(500).json({ error: 'Echo failed: ' + err.message });
  }
});

// Called by the cron job in server.js
async function sendPreVisitBriefing(booking_id) {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        sessions(date, time_start,
          legends(name, village, age, specialty, story,
            knowledge_docs(content)
          )
        ),
        travelers(interests, profiles(name))
      `)
      .eq('id', booking_id)
      .single();

    if (!booking) return;

    const legend = booking.sessions.legends;
    const traveler = booking.travelers;
    const knowledgeDocs = legend.knowledge_docs?.map(d => d.content).join('\n\n') || '';

    const { data: { user } } = await supabase.auth.admin.getUserById(booking.traveler_id);
    if (!user?.email) return;

    const prompt = `You are preparing a traveler for a meaningful meeting with a local knowledge carrier in Bulgaria. This is not a tourist activity — it is a genuine human encounter.

TRAVELER:
Name: ${traveler.profiles.name}
Interests: ${traveler.interests}

LEGEND THEY ARE MEETING:
Name: ${legend.name}
Age: ${legend.age}
Village: ${legend.village}
Specialty: ${legend.specialty}
About them: ${legend.story}
Their knowledge: ${knowledgeDocs}

Write a warm, personal pre-visit briefing for the traveler. Include EXACTLY these four sections:

1. ABOUT THE PLACE (2 sentences about the village and what makes it special)
2. HOW TO GREET (specific customs for this region — handshake? Both hands? What to say?)
3. ONE THING NOT TO DO (a specific cultural mistake to avoid)
4. THE MAGIC QUESTION (one question that will make this legend light up and talk for hours)

Maximum 200 words total. Excited, warm, personal tone.`;

    const briefing = await askClaude(prompt, 400);

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: 'PingMe <hello@pingme.bg>',
      to: user.email,
      subject: `Your visit with ${legend.name} is tomorrow`,
      html: `
        <h2>See you tomorrow in ${legend.village}!</h2>
        <p>Here is everything you need to know before you meet ${legend.name}:</p>
        <div style="background:#f5f5f5;padding:20px;border-radius:8px;font-family:sans-serif;line-height:1.6;">
          ${briefing.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top:16px;">Your session is at <strong>${booking.sessions.time_start}</strong> in ${legend.village}.</p>
        <p>Don't forget your QR code for entry.</p>
      `
    });
  } catch (err) {
    console.error('Pre-visit briefing failed for booking', booking_id, err.message);
  }
}

module.exports = router;
module.exports.sendPreVisitBriefing = sendPreVisitBriefing;
