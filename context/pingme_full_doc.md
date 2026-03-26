# PingMe — Complete Project Documentation
### Hack TUES 12 | Code to Care | 28-Hour Build Plan

---

## Table of Contents

1. [What PingMe Is](#1-what-pingme-is)
2. [The Problem We Solve](#2-the-problem-we-solve)
3. [How It Works — User Journeys](#3-how-it-works--user-journeys)
4. [Business Model](#4-business-model)
5. [Tech Stack](#5-tech-stack)
6. [System Architecture — How Data Flows](#6-system-architecture--how-data-flows)
7. [Database Design](#7-database-design)
8. [AI Integration — All 4 Features](#8-ai-integration--all-4-features)
9. [Hour by Hour — 28 Hour Plan](#9-hour-by-hour--28-hour-plan)
10. [File Structure](#10-file-structure)
11. [All Pages and Features](#11-all-pages-and-features)
12. [Pitch Script](#12-pitch-script)

---

## 1. What PingMe Is

PingMe is a platform that connects travelers with **local knowledge carriers** — the last living people who possess irreplaceable crafts, recipes, stories, and techniques in Bulgaria's villages and small towns.

These people are not on Airbnb. They do not speak English. They do not have Stripe accounts. They are between 65 and 90 years old. When they die, everything they know dies with them — forever.

PingMe makes them:
- **Findable** — on an interactive map with live markers
- **Bookable** — travelers reserve sessions directly online
- **Preserved** — AI interviews them and documents their knowledge before it is gone

### Why "PingMe"

A ping is a signal sent across distance to say: *I see you. I know you are there. I am coming.* These legends have been invisible to the modern world. PingMe sends the signal.

### The One Thing Judges Will Remember

Every legend's profile has an **Extinction Countdown** — a live timer showing how many sessions remain at the current booking rate. It updates every time someone books. When it hits zero, the legend closes. The urgency is real, not manufactured.

---

## 2. The Problem We Solve

### The Human Problem

Bulgaria has thousands of villages where irreplaceable human knowledge exists:

- Traditional crafts passed down for 300+ years
- Oral histories never written in any book
- Ancient recipes existing only in one person's memory
- Techniques impossible to learn from YouTube or Google

This knowledge lives in people aged 70–90. It is passed down **only through direct contact**. When those people die, the knowledge is gone. Not archived. Not digitized. Simply gone.

### The Traveler Problem

At the same time, a growing generation of travelers actively rejects generic tourism:
- They don't want another Airbnb apartment
- They don't want a bus tour with 40 strangers
- They want something **real**, **unrepeatable**, and **meaningful**

These two groups never meet. There is no platform for this. Until PingMe.

### Why Nothing Else Solves It

| Platform | Why it fails |
|---|---|
| Airbnb Experiences | Requires English, Stripe, professional photos, regular schedule |
| Viator / GetYourGuide | Requires registered business, consistent delivery |
| Facebook | No structure, no booking, no trust, no discovery |
| Google Maps | Shows places, not people |
| Nothing | Correct answer before PingMe |

PingMe takes on **all the administrative burden**. The legend only needs to know something irreplaceable.

---

## 3. How It Works — User Journeys

### Traveler Journey

```
1. Lands on homepage
         ↓
2. Sees interactive map of legends nearby
         ↓
3. Fills 5-question AI matching profile
         ↓
4. AI recommends ONE specific legend with a personal explanation why
         ↓
5. Views legend profile: story, specialty, knowledge docs, extinction countdown, reviews
         ↓
6. Picks a date from availability calendar
         ↓
7. Books — slot is locked for 15 minutes — receives QR confirmation
         ↓
8. Receives personalized AI cultural briefing by email 24h before
         ↓
9. Arrives, scans QR code, attends session
         ↓
10. Receives Memory Package PDF with transcript and key learnings
         ↓
11. Leaves review — AI analyzes sentiment across 5 dimensions
         ↓
12. Experience Passport gets a new stamp (visual, shareable)
```

### Legend Journey

```
1. Volunteer or family member helps them register
         ↓
2. AI Debrief — AI interviews legend in simple Bulgarian
         ↓
3. Knowledge document auto-generated from interview
         ↓
4. Profile goes live on map after admin approval
         ↓
5. Legend sees incoming bookings in simple dashboard
         ↓
6. Confirms or declines, manages available dates
         ↓
7. Greets traveler, scans their QR code at arrival
         ↓
8. Receives 80% of session fee directly
```

### Volunteer Journey

```
1. Registers as Volunteer role
         ↓
2. Gets assigned legends in their area needing help
         ↓
3. Visits in person, assists with registration and Debrief interview
         ↓
4. Uploads photos, pins location on map
         ↓
5. Submits profile for admin approval
```

---

## 4. Business Model

### How PingMe Makes Money

#### Primary Revenue — Commission Per Booking

- Traveler pays the session fee online
- **80% goes directly to the legend**
- **20% goes to PingMe as platform commission**

Example calculation:
```
Session price: €30
Legend receives: €24 (80%)
PingMe receives: €6 (20%)
```

Why 80/20 is competitive:
- Airbnb takes 15–20% from hosts
- Uber takes 25–30% from drivers
- PingMe takes 20% but provides: full profile creation, payment processing, trust system, AI preservation, marketing, and discovery — the legend pays nothing upfront

#### Secondary Revenue — Institutional Partnerships

- Regional tourism boards pay for coverage and data reports
- Museums and cultural institutions pay for access to the knowledge archive
- Universities pay for research access to the oral history database
- NGOs pay for documented cultural preservation output

#### Tertiary Revenue — Knowledge Archive Licensing

- Knowledge documents generated by AI Debrief become a growing cultural database
- After a legend passes away, the archive becomes a licensable asset
- Documentary filmmakers, publishers, researchers, and educators pay for access

### Cost Structure

| Monthly Cost | Amount |
|---|---|
| Supabase Pro plan | €25 |
| Anthropic API (depends on usage) | €50–200 |
| Domain + VPS hosting | €15 |
| Email service (Resend) | €0–20 |
| **Total per month** | **€90–260** |

### Break-Even Analysis

At €6 average commission per booking:
- PingMe needs **15–44 bookings/month** to cover costs
- One active legend doing 2 sessions per weekend = 8 bookings/month
- Three active legends = already near break-even

### Growth Projections

| Stage | Legends | Sessions/month | Revenue/month |
|---|---|---|---|
| Launch (BG) | 20 | 60 | €360 |
| Growth (BG) | 100 | 400 | €2,400 |
| Scale (Balkans) | 500 | 2,000 | €12,000 |
| Europe | 2,000 | 10,000 | €60,000 |

### Why Competitors Cannot Copy This Easily

1. **Supply side barrier** — legends are found through offline relationships, not SEO or ads. You cannot automate finding a 78-year-old woman who makes lokum from a 1920 recipe. This takes time and trust.
2. **AI knowledge archive** — every Debrief interview compounds in value. After 1,000 interviews, PingMe owns the largest archive of Bulgarian oral cultural heritage in the world.
3. **First mover** — no competitor exists in this niche in Bulgaria or the Balkans
4. **Ethical positioning** — 80% to legends creates genuine loyalty. Legends will not leave for a competitor offering 70%.

---

## 5. Tech Stack

### Full Stack Overview

```
┌─────────────────────────────────────┐
│           BROWSER                   │
│   HTML + CSS + Vanilla JavaScript   │
│   Leaflet.js (maps)                 │
│   Chart.js (charts)                 │
│   Canvas API (passport)             │
└──────────────┬──────────────────────┘
               │ HTTP requests (fetch)
               ↕
┌──────────────────────────────────────┐
│           NODE.JS BACKEND           │
│   Express.js (API routes)           │
│   Middleware (auth, cors, upload)   │
│   Cron jobs (reminders, locks)      │
└──────┬──────────────────┬───────────┘
       │                  │
       ↕                  ↕
┌──────────────┐  ┌──────────────────┐
│  SUPABASE    │  │  ANTHROPIC API   │
│  PostgreSQL  │  │  Claude Sonnet   │
│  Auth        │  │  (AI features)   │
│  Storage     │  └──────────────────┘
│  (photos)    │
└──────────────┘
```

### Why Each Technology Was Chosen

#### HTML + CSS + Vanilla JavaScript (Frontend)
- **HTML** — structure of every page, semantic elements
- **CSS** — all styling, animations, responsive design, CSS variables for theming
- **Vanilla JS** — all interactivity, API calls, DOM updates, map, charts
- No React or Vue — keeps it simple enough to build in 28 hours
- No jQuery — modern JS is more than capable
- **Leaflet.js** — open source interactive maps, free, excellent documentation
- **Chart.js** — data visualizations (radar charts for reviews, bar charts for earnings)
- **Canvas API** — Experience Passport stamp generation (built into browser, no library needed)
- **Quill.js** — rich text editor for knowledge documents

#### Node.js + Express (Backend)
- **Node.js** — JavaScript on the server, same language as frontend so team doesn't context switch
- **Express** — minimal framework for creating API routes, very fast to set up
- All requests between frontend and Supabase/Anthropic go through here
- **Critical**: your Anthropic API key is stored here only — never exposed to the browser
- Can run locally during hackathon, deploy to Railway or Render if needed

#### Supabase (Database + Auth + Storage)
- **PostgreSQL** database hosted in the cloud — no local database setup needed
- **Built-in Auth** — email/password authentication, JWT tokens, all handled for you
- **File Storage** — legend photos uploaded here, served via public URL
- **Dashboard** — you can see and edit data directly at supabase.com during development
- Free tier handles hackathon load easily
- SDK available for both Node.js and browser

#### Anthropic API (Claude AI)
- Called **only from Node.js backend** — API key never goes to browser
- Model: `claude-sonnet-4-20250514`
- Four distinct use cases: matchmaking, debrief interview, cultural briefing, review analysis
- Billed per token — keep prompts focused, 500 max_tokens is usually enough

### Package List

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "@supabase/supabase-js": "^2.39.0",
    "multer": "^1.4.5",
    "nodemailer": "^6.9.0",
    "node-cron": "^3.0.3"
  }
}
```

Frontend libraries loaded via CDN (no npm needed):
```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
```

---

## 6. System Architecture — How Data Flows

### Example Flow 1: Traveler Gets AI Match

```
1. User clicks "Find My Match" button in browser
         ↓
2. JS in browser sends POST to: http://localhost:3000/api/ai/match
   Body: { traveler_id: "abc-123" }
         ↓
3. Express route in Node.js receives request
   - Checks auth token in header
   - Validates traveler_id
         ↓
4. Node.js queries Supabase:
   SELECT * FROM travelers WHERE id = 'abc-123'
   SELECT id, name, village, specialty, story FROM legends WHERE is_verified = true
         ↓
5. Supabase returns traveler data + array of all legends
         ↓
6. Node.js builds a text prompt combining traveler profile + all legend descriptions
         ↓
7. Node.js sends POST to https://api.anthropic.com/v1/messages
   with the prompt and API key in the header
         ↓
8. Anthropic Claude reads the prompt, picks best legend, writes reason
   Returns: { "legend_id": 3, "reason": "Bai Stoyan's cave knowledge..." }
         ↓
9. Node.js parses the JSON response from Claude
   Fetches full legend data from Supabase: SELECT * FROM legends WHERE id = 3
         ↓
10. Node.js sends response back to browser:
    { success: true, match: { name, village, story... }, reason: "..." }
         ↓
11. JS in browser animates the reveal, displays matched legend card
```

### Example Flow 2: Traveler Books a Session

```
1. User clicks on a date in the availability calendar
         ↓
2. JS sends POST to /api/bookings
   Body: { session_id: 7, traveler_id: "abc-123", participants: 2 }
         ↓
3. Node.js receives request, checks auth token
         ↓
4. Node.js runs in a transaction on Supabase:
   - Check session status is 'open' (not already locked or booked)
   - UPDATE sessions SET status='locked', locked_until=NOW()+15min WHERE id=7
   - INSERT INTO bookings (session_id, traveler_id, ...) VALUES (...)
   - Generate unique QR token: crypto.randomUUID()
   - Save token to booking record
         ↓
5. Supabase saves everything, returns new booking ID
         ↓
6. Node.js sends email with booking confirmation (nodemailer)
         ↓
7. Node.js returns to browser:
   { success: true, booking_id: 42, qr_token: "xyz-unique-token" }
         ↓
8. JS generates QR code from the token (qrcode.js library)
   Displays QR code on screen and in confirmation email
         ↓
9. Background cron job runs every 60 seconds:
   - Find all sessions where locked_until < NOW() and status = 'locked'
   - If no matching booking exists: UPDATE status back to 'open'
   - This auto-releases locks if user abandoned the booking
```

### Example Flow 3: Photo Upload for Legend

```
1. Legend selects photo in registration form
         ↓
2. JS creates FormData object with the image file
   Sends POST to /api/upload with FormData
         ↓
3. Node.js receives file via multer middleware
   multer stores it temporarily in memory
         ↓
4. Node.js uploads to Supabase Storage:
   supabase.storage.from('legend-photos').upload(filename, fileBuffer)
         ↓
5. Supabase stores the file, returns public URL:
   https://xxxx.supabase.co/storage/v1/object/public/legend-photos/filename.jpg
         ↓
6. Node.js saves that URL to the legends table:
   UPDATE legends SET photo_url = 'https://...' WHERE id = ?
         ↓
7. Node.js returns URL to browser
         ↓
8. JS shows preview image using that URL in the <img> tag
```

### How Authentication Works on Every Request

```
Every protected route does this:

Browser sends request with header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                        ↑ JWT token stored in localStorage
         ↓
Node.js middleware (auth.js) intercepts request BEFORE the route handler:
- Extracts token from Authorization header
- Calls: supabase.auth.getUser(token)
- Supabase verifies token signature and expiry
- Returns: { user: { id, email, role } }
         ↓
If token valid: attach user to request object, continue to route
If token invalid: return 401 Unauthorized immediately
         ↓
Route handler runs, can access req.user.id safely
```

---

## 7. Database Design

Run this SQL in Supabase SQL Editor to create all tables:

```sql
-- ============================================================
-- PROFILES
-- Extends Supabase's built-in auth.users table
-- One profile per user account
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  -- UUID links to Supabase Auth user
  -- ON DELETE CASCADE = if auth user is deleted, profile is deleted too
  role VARCHAR(20) DEFAULT 'traveler',
  -- 'traveler', 'legend', 'volunteer', 'admin'
  name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TRAVELERS
-- Extra data for users with role = 'traveler'
-- ============================================================
CREATE TABLE travelers (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  interests TEXT,
  -- "I love old crafts, oral history, slow travel"
  travel_style TEXT,
  -- "curious, patient, loves long conversations"
  looking_for TEXT,
  -- "something I cannot find on Google"
  trust_score DECIMAL(3,1) DEFAULT 5.0,
  -- 1.0 to 10.0, increases with completed sessions and good reviews
  total_sessions INT DEFAULT 0
);

-- ============================================================
-- LEGENDS
-- The local knowledge carriers
-- ============================================================
CREATE TABLE legends (
  id SERIAL PRIMARY KEY,
  -- SERIAL = auto-incrementing integer
  owner_id UUID REFERENCES profiles(id),
  -- Which volunteer or family account manages this legend
  name VARCHAR(100) NOT NULL,
  village VARCHAR(100) NOT NULL,
  lat DECIMAL(10,8),
  -- Latitude coordinate for map marker
  -- Example: 41.70361 (Trigrad village)
  lng DECIMAL(11,8),
  -- Longitude coordinate for map marker
  -- Example: 24.39000 (Trigrad village)
  specialty TEXT,
  -- Short one-line description: "Copper pot forging since 1962"
  story TEXT,
  -- Full description shown on profile page
  age INT,
  price_base DECIMAL(8,2),
  -- Base price per session in Euros
  extinction_risk INT DEFAULT 50,
  -- 0 = no risk, 100 = critically endangered
  -- Calculated from: age, health notes, sessions remaining
  is_verified BOOLEAN DEFAULT FALSE,
  -- Admin must approve before legend appears on map
  photo_url TEXT,
  -- Public URL from Supabase Storage
  sessions_completed INT DEFAULT 0,
  -- Incremented every time a booking is marked complete
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- KNOWLEDGE DOCUMENTS
-- AI-generated from Debrief interview, public on profile
-- ============================================================
CREATE TABLE knowledge_docs (
  id SERIAL PRIMARY KEY,
  legend_id INT REFERENCES legends(id) ON DELETE CASCADE,
  title VARCHAR(200),
  -- Example: "The Secret of the Rhodope Lokum"
  content TEXT,
  -- Rich text HTML from Quill editor
  audio_url TEXT,
  -- URL to recorded audio if legend recorded voice
  is_public BOOLEAN DEFAULT TRUE,
  -- False = only visible to admin and the legend
  version INT DEFAULT 1,
  -- Incremented when document is updated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SESSIONS
-- Bookable time slots created by legends
-- ============================================================
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  legend_id INT REFERENCES legends(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_start TIME NOT NULL,
  duration_minutes INT DEFAULT 120,
  -- Most sessions are 2 hours
  max_participants INT DEFAULT 8,
  -- Maximum people allowed per session
  current_participants INT DEFAULT 0,
  -- Incremented when booking is confirmed
  status VARCHAR(20) DEFAULT 'open',
  -- 'open'      = available to book
  -- 'locked'    = someone is mid-booking (15 min hold)
  -- 'full'      = max_participants reached
  -- 'completed' = session happened
  -- 'cancelled' = legend cancelled
  locked_until TIMESTAMP WITH TIME ZONE,
  -- When the lock expires (used with cron job to auto-release)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BOOKINGS
-- When a traveler books a session
-- ============================================================
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES sessions(id),
  traveler_id UUID REFERENCES travelers(id),
  participants INT DEFAULT 1,
  -- How many people this booking is for
  total_price DECIMAL(8,2),
  -- Full amount traveler pays
  platform_fee DECIMAL(8,2),
  -- 20% of total_price (PingMe's revenue)
  legend_payout DECIMAL(8,2),
  -- 80% of total_price (legend's earnings)
  status VARCHAR(20) DEFAULT 'pending',
  -- 'pending'   = booked, not yet confirmed by legend
  -- 'confirmed' = legend confirmed
  -- 'completed' = session happened
  -- 'cancelled' = cancelled by either party
  -- 'disputed'  = problem reported
  qr_token VARCHAR(64) UNIQUE,
  -- Unique random token for QR code entry
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- Left by traveler after completed booking
-- ============================================================
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id) UNIQUE,
  -- One review per booking maximum
  reviewer_id UUID REFERENCES profiles(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  -- Free text review from traveler
  ai_sentiment JSONB,
  -- JSON from AI analysis:
  -- { authenticity: 9, uniqueness: 10, educational_value: 8,
  --   emotional_impact: 9, would_recommend: 10,
  --   key_themes: ["crafts", "storytelling"],
  --   one_line_summary: "..." }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TRANSCRIPTS
-- Session recordings for Echo feature (with consent)
-- ============================================================
CREATE TABLE transcripts (
  id SERIAL PRIMARY KEY,
  legend_id INT REFERENCES legends(id) ON DELETE CASCADE,
  session_id INT REFERENCES sessions(id),
  raw_text TEXT,
  -- Full transcript text
  processed_knowledge JSONB,
  -- Structured knowledge extracted by AI
  consent_given BOOLEAN DEFAULT FALSE,
  -- Legend must explicitly consent before transcript is used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- WISHLISTS
-- Travelers saving legends for later
-- ============================================================
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  traveler_id UUID REFERENCES travelers(id) ON DELETE CASCADE,
  legend_id INT REFERENCES legends(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(traveler_id, legend_id)
  -- Prevent duplicate wishlist entries
);

-- ============================================================
-- SEED DATA — Fake legends for testing
-- ============================================================
INSERT INTO legends (name, village, lat, lng, specialty, story, age, price_base, extinction_risk, is_verified) VALUES
(
  'Bai Stoyan Petkov',
  'Trigrad',
  41.70361,
  24.39000,
  'Cave explorer and local oral historian',
  'Stoyan has spent 54 years exploring every cave system in the Rhodope mountains. He knows stories about each formation that appear in no book, no documentary, and no website. His grandfather taught him the names the locals give to caves — names that existed before the Ottoman empire.',
  74,
  25.00,
  78,
  TRUE
),
(
  'Baba Kina Georgieva',
  'Koprivshtitsa',
  42.63500,
  24.34000,
  'Traditional rose lokum from 1920 family recipe',
  'Kina learned to make lokum sitting beside her grandmother in 1962. The recipe uses rose water from their own garden, a specific copper pot bought in 1934, and a technique for testing readiness that cannot be described in words — only felt. She has never written it down.',
  79,
  20.00,
  85,
  TRUE
),
(
  'Dyado Nikola Hristov',
  'Etara',
  42.68300,
  25.33400,
  'Ottoman-era copper pot forging technique',
  'Nikola is the last living person in Bulgaria who forges copper pots using the technique brought from Anatolia in the 18th century. He learned from his father, who learned from his father. His hands know things that no YouTube video can teach.',
  82,
  35.00,
  92,
  TRUE
),
(
  'Baba Maria Stoyanova',
  'Zheravna',
  42.87100,
  26.45700,
  'Zheravna carpet weaving and natural dyeing',
  'Maria has been weaving the traditional Zheravna carpet pattern since she was 14 years old. She still collects plants from the meadow behind her house to make the natural dyes — a practice she is the last person in the village to know.',
  71,
  30.00,
  65,
  TRUE
),
(
  'Dyadoto Ivan Kolev',
  'Shiroka Laka',
  41.66700,
  24.52200,
  'Rhodope gaida (bagpipe) making and tuning',
  'Ivan makes gaidas entirely by hand from goat skin and cherry wood. He can tune a gaida by ear alone, adjusting the drone pipe to match the exact pitch of a specific mountain valley. He has made 340 gaidas over 50 years.',
  77,
  40.00,
  70,
  TRUE
);
```

---

## 8. AI Integration — All 4 Features

All AI calls are made from Node.js backend only. The Anthropic API key is stored in `.env` and never sent to the browser.

### Setup in server/config/anthropic.js

```javascript
// This function is used by all AI routes
// It sends a prompt to Claude and returns the text response

async function askClaude(prompt, maxTokens = 500) {
  // fetch is available in Node.js 18+
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      // process.env reads from your .env file
      'anthropic-version': '2023-06-01'
      // Required header - tells Anthropic which API version to use
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [
        { role: 'user', content: prompt }
        // We always send as a single user message
        // Claude will respond as assistant
      ]
    })
  });

  const data = await response.json();
  // data.content is an array of content blocks
  // data.content[0].text is the actual text response
  return data.content[0].text;
}

module.exports = { askClaude };
```

### AI Feature 1 — Semantic Matchmaking

**File:** `server/routes/ai.js`
**Endpoint:** `POST /api/ai/match`
**Called when:** Traveler submits their 5-question profile form

```javascript
router.post('/match', authMiddleware, async (req, res) => {
  const { traveler_id } = req.body;

  // Step 1: Get traveler profile from Supabase
  const { data: traveler } = await supabase
    .from('travelers')
    .select('*, profiles(name)')
    .eq('id', traveler_id)
    .single();

  // Step 2: Get all verified legends
  const { data: legends } = await supabase
    .from('legends')
    .select('id, name, village, specialty, story, age')
    .eq('is_verified', true);

  // Step 3: Format legends list as readable text
  const legendsList = legends.map(l =>
    `LEGEND ID ${l.id}:
    Name: ${l.name}
    Village: ${l.village}
    Age: ${l.age}
    Specialty: ${l.specialty}
    Story: ${l.story}
    ---`
  ).join('\n');

  // Step 4: Build and send prompt
  const prompt = `
You are a matchmaking system for PingMe — a platform connecting
travelers with local knowledge carriers in Bulgarian villages.
These are real elderly people with irreplaceable knowledge.

TRAVELER PROFILE:
Name: ${traveler.profiles.name}
Interests: ${traveler.interests}
Travel style: ${traveler.travel_style}
What they are looking for: ${traveler.looking_for}

AVAILABLE LEGENDS:
${legendsList}

Read the traveler profile carefully.
Compare it against every legend description.
Choose the ONE best semantic match — not keyword matching,
but which person this traveler would genuinely connect with.

Respond with ONLY this JSON, no other text:
{
  "legend_id": <the ID number of your chosen legend>,
  "reason": "<2-3 warm, personal sentences explaining why exactly these two should meet>"
}`;

  const aiResponse = await askClaude(prompt, 400);

  // Extract JSON from response (AI sometimes adds text around it)
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch[0]);

  // Get full legend data for the match
  const { data: matchedLegend } = await supabase
    .from('legends')
    .select('*')
    .eq('id', result.legend_id)
    .single();

  res.json({ success: true, match: matchedLegend, reason: result.reason });
});
```

**Frontend call (match.js):**
```javascript
async function runMatchmaking() {
  const travelerId = localStorage.getItem('user_id');

  // Show loading animation
  document.getElementById('match-loading').style.display = 'block';

  const response = await fetch('/api/ai/match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ traveler_id: travelerId })
  });

  const data = await response.json();

  // Hide loading, animate reveal
  document.getElementById('match-loading').style.display = 'none';
  document.getElementById('match-result').style.display = 'block';

  document.getElementById('match-name').textContent = data.match.name;
  document.getElementById('match-village').textContent = data.match.village;
  document.getElementById('match-specialty').textContent = data.match.specialty;
  document.getElementById('match-reason').textContent = data.reason;
  document.getElementById('match-photo').src = data.match.photo_url;

  document.getElementById('view-profile-btn').href = `/legend.html?id=${data.match.id}`;
}
```

### AI Feature 2 — Debrief Interview

**File:** `server/routes/ai.js`
**Endpoint:** `POST /api/ai/debrief`
**Called when:** Legend is going through registration and wants AI to interview them

The Debrief works as a conversation. The frontend sends the full conversation history each time, and the AI generates the next question.

```javascript
router.post('/debrief', authMiddleware, async (req, res) => {
  const { conversation_history, latest_answer, specialty } = req.body;
  // conversation_history = array of { question, answer } objects

  // Format previous conversation as text
  const historyText = conversation_history.map(turn =>
    `Question: ${turn.question}\nAnswer: ${turn.answer}`
  ).join('\n\n');

  const prompt = `
You are interviewing an elderly Bulgarian person to extract their
tacit knowledge — the things they know in their hands and feelings,
not just their words.

Their specialty: ${specialty}

Previous conversation:
${historyText}

Their latest answer: "${latest_answer}"

Your task: Generate ONE follow-up question.
Rules:
- Use extremely simple language (they may have limited education)
- Be warm, patient, and genuinely curious
- If they mentioned a physical feeling or intuition, ask them to
  describe it more specifically ("What does it feel like? Warm? Heavy?")
- If they mentioned a step in a process, ask what happens if they skip it
- Never ask multiple questions at once
- Maximum 2 sentences
- Write in Bulgarian

Respond with only the question text, nothing else.`;

  const nextQuestion = await askClaude(prompt, 200);

  res.json({ success: true, next_question: nextQuestion });
});

// Separate endpoint to generate the final knowledge document
router.post('/debrief/finalize', authMiddleware, async (req, res) => {
  const { legend_id, full_conversation, specialty } = req.body;

  const conversationText = full_conversation.map(turn =>
    `Q: ${turn.question}\nA: ${turn.answer}`
  ).join('\n\n');

  const prompt = `
Based on this interview with a Bulgarian knowledge carrier,
create a structured knowledge document.

Their specialty: ${specialty}

Full interview:
${conversationText}

Create a clear, well-organized document that captures:
1. The core technique or knowledge
2. Key steps in order
3. The subtle things only they know (the feelings, timing, intuitions)
4. History and context
5. Any warnings or common mistakes

Write in English. Make it readable and engaging.
Format with clear headings using markdown.`;

  const document = await askClaude(prompt, 1000);

  // Save to database
  await supabase.from('knowledge_docs').insert({
    legend_id: legend_id,
    title: `The Knowledge of ${specialty}`,
    content: document,
    is_public: true
  });

  res.json({ success: true, document });
});
```

### AI Feature 3 — Pre-Visit Cultural Briefing

**File:** `server/routes/ai.js`
**Endpoint:** Called by cron job 24 hours before each session
**Result:** Email sent to traveler with personalized briefing

```javascript
// This function is called by the cron job, not directly by users
async function sendPreVisitBriefing(booking_id) {

  // Get all needed data in one Supabase query
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      sessions (
        date,
        time_start,
        legends (
          name, village, age, specialty, story, photo_url,
          knowledge_docs (content)
        )
      ),
      travelers (
        interests,
        profiles (name, email: auth.users(email))
      )
    `)
    .eq('id', booking_id)
    .single();

  const legend = booking.sessions.legends;
  const traveler = booking.travelers;
  const knowledgeDocs = legend.knowledge_docs.map(d => d.content).join('\n\n');

  const prompt = `
You are preparing a traveler for a meaningful meeting with a local
knowledge carrier in Bulgaria. This is not a tourist activity —
it is a genuine human encounter.

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

Write a warm, personal pre-visit briefing for the traveler.
Include EXACTLY these four sections:

1. ABOUT THE PLACE (2 sentences about the village and what makes it special)
2. HOW TO GREET (specific customs for this region — handshake? Both hands? What to say?)
3. ONE THING NOT TO DO (a specific cultural mistake to avoid)
4. THE MAGIC QUESTION (one question that will make this legend light up and talk for hours)

Maximum 200 words total. Excited, warm, personal tone.
Write as if you are a close friend giving advice before a special trip.`;

  const briefing = await askClaude(prompt, 400);

  // Send email using nodemailer
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: 'PingMe <hello@pingme.bg>',
    to: traveler.profiles.email,
    subject: `Your visit with ${legend.name} is tomorrow`,
    html: `
      <h2>See you tomorrow in ${legend.village}!</h2>
      <p>Here is everything you need to know before you meet ${legend.name}:</p>
      <div style="background:#f5f5f5;padding:20px;border-radius:8px;">
        ${briefing.replace(/\n/g, '<br>')}
      </div>
      <p>Your session is at ${booking.sessions.time_start} in ${legend.village}.</p>
      <p>Don't forget your QR code for entry.</p>
    `
  });
}

// Cron job — runs every hour, sends briefings for sessions happening in 24h
const cron = require('node-cron');
cron.schedule('0 * * * *', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('id, sessions(date)')
    .eq('status', 'confirmed')
    .eq('sessions.date', tomorrowDate);

  for (const booking of upcomingBookings) {
    await sendPreVisitBriefing(booking.id);
  }
});
```

### AI Feature 4 — Review Sentiment Analysis

**File:** `server/routes/reviews.js`
**Triggered:** Automatically when a traveler submits a review

```javascript
router.post('/', authMiddleware, async (req, res) => {
  const { booking_id, rating, text } = req.body;

  // Step 1: Save review to database
  const { data: review } = await supabase
    .from('reviews')
    .insert({ booking_id, reviewer_id: req.user.id, rating, text })
    .select()
    .single();

  // Step 2: Run AI sentiment analysis in background
  // We don't make the user wait for this
  analyzeSentiment(review.id, text);

  res.json({ success: true, review_id: review.id });
});

async function analyzeSentiment(review_id, text) {
  const prompt = `
Analyze this review of a local cultural experience in Bulgaria.
Rate it on 5 dimensions.

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

  // Save sentiment back to the review
  await supabase
    .from('reviews')
    .update({ ai_sentiment: sentiment })
    .eq('id', review_id);
}
```

**Frontend — showing sentiment as radar chart (Chart.js):**
```javascript
function renderSentimentChart(sentiment) {
  const ctx = document.getElementById('sentiment-chart').getContext('2d');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Authenticity', 'Uniqueness', 'Educational', 'Emotional', 'Recommend'],
      datasets: [{
        data: [
          sentiment.authenticity,
          sentiment.uniqueness,
          sentiment.educational_value,
          sentiment.emotional_impact,
          sentiment.would_recommend
        ],
        backgroundColor: 'rgba(255, 107, 53, 0.2)',
        borderColor: 'rgba(255, 107, 53, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: { r: { min: 0, max: 10 } }
    }
  });
}
```

---

## 9. Hour by Hour — 28 Hour Plan

> Team size assumption: 3 people.
> Person A = Backend (Node.js, Supabase, API routes)
> Person B = Frontend (HTML, CSS, JS, maps, UI)
> Person C = AI + Integration (AI routes, connecting frontend to backend)

> Rule: Never have two people editing the same file at the same time.

---

### HOUR 1–2 | Foundation Setup

**All three together (fastest to do as a team)**

```
☐ Create Supabase project at supabase.com
☐ Copy credentials: project URL, anon key, service key, DB password
☐ Create GitHub repo, clone to all computers
☐ Create project folder structure
☐ npm init -y
☐ npm install express cors dotenv @supabase/supabase-js nodemailer node-cron multer
☐ Create .env file with all credentials
☐ Create .gitignore (add .env and node_modules)
☐ Run all CREATE TABLE SQL in Supabase SQL Editor
☐ Run seed data SQL (insert 5 test legends)
☐ Create server.js skeleton, confirm it runs on port 3000
☐ Create public/index.html skeleton, confirm Express serves it
```

**End of hour 2:** Server runs, database has tables and data, everyone can see the site

---

### HOUR 3–4 | Core Backend + Base Styles

**Person A — Backend routes**
```
☐ server/config/supabase.js — Supabase client
☐ server/config/anthropic.js — askClaude function
☐ server/middleware/auth.js — verify JWT token
☐ server/routes/legends.js:
   ☐ GET /api/legends — all verified legends (id, name, village, lat, lng, specialty, extinction_risk)
   ☐ GET /api/legends/:id — single legend full data
   ☐ GET /api/legends/:id/sessions — available booking slots
☐ Test all routes in browser: localhost:3000/api/legends
```

**Person B — Base CSS and HTML**
```
☐ public/css/style.css:
   ☐ CSS custom properties (--color-primary, --color-text, etc.)
   ☐ Reset styles
   ☐ Typography (font-family, sizes, line heights)
   ☐ Base layout classes
☐ public/css/components.css:
   ☐ Button styles (.btn, .btn-primary, .btn-secondary)
   ☐ Card styles (.card)
   ☐ Input styles
   ☐ Badge styles
☐ public/js/api.js:
   ☐ apiGet(endpoint) function — fetch GET with auth header
   ☐ apiPost(endpoint, body) function — fetch POST with auth header
   ☐ Error handling for failed requests
```

**Person C — AI Matchmaking**
```
☐ server/routes/ai.js — route file setup
☐ Implement POST /api/ai/match
☐ Test with Postman: send fake traveler_id, verify it returns a legend + reason
☐ Handle edge cases: no legends found, AI returns invalid JSON
```

**End of hour 4:** API returns legend data, CSS variables set up, AI match works

---

### HOUR 5–6 | Homepage + Map

**Person A**
```
☐ GET /api/stats — returns { total_legends, total_sessions, knowledge_docs_count }
☐ Serve public folder as static: app.use(express.static('public'))
☐ GET /api/legends/nearby?lat=X&lng=Y&radius=50 — Haversine distance filter
```

**Person B**
```
☐ public/index.html full structure:
   ☐ Navigation bar with logo and nav links
   ☐ Hero section: headline, subheadline, two CTA buttons
   ☐ Animated counter section (updated by JS from /api/stats)
   ☐ "How it works" section: 3 steps with icons
   ☐ Map preview section (placeholder for now)
   ☐ Footer
☐ public/map.html:
   ☐ Full-screen map container
   ☐ Sidebar div for filters and results
☐ public/js/map.js:
   ☐ Initialize Leaflet map centered on Bulgaria
   ☐ Fetch /api/legends
   ☐ Place markers (green if extinction_risk < 50, yellow 50-75, red 75+)
   ☐ Popup on click: name, village, specialty, "View Profile" link
```

**Person C**
```
☐ server/routes/ai.js — add POST /api/ai/debrief
☐ Test debrief conversation manually with 3 exchanges
☐ Add POST /api/ai/debrief/finalize — generate knowledge document
```

**End of hour 6:** Homepage loads with live stats, map shows colored legend markers

---

### HOUR 7–8 | Legend Profile Page

**Person A**
```
☐ GET /api/legends/:id/reviews — reviews with ai_sentiment data
☐ GET /api/legends/:id/knowledge — public knowledge documents
☐ GET /api/sessions/:id — single session details
```

**Person B**
```
☐ public/legend.html full page:
   ☐ Hero: photo, name, village, age, specialty
   ☐ EXTINCTION COUNTDOWN — large animated number, JS-calculated, red when < 10
   ☐ Story section
   ☐ Knowledge document section (render HTML content)
   ☐ Availability calendar (custom JS, colored dates)
   ☐ Price section with breakdown
   ☐ Reviews section with radar chart (Chart.js)
   ☐ "Book This Session" button → triggers booking flow
☐ public/js/countdown.js:
   ☐ Calculate sessions remaining from booking rate
   ☐ Animate number counting down
   ☐ Turn red when under 10
```

**Person C**
```
☐ Wire /api/ai/analyze-review to fire when review is submitted
☐ Test full review submission → check ai_sentiment saved in Supabase
☐ Start on /api/ai/briefing — pre-visit email logic
```

**End of hour 8:** Full legend profile page with countdown, map, reviews

---

### HOUR 9–10 | Auth System

**Person A**
```
☐ server/routes/auth.js:
   ☐ POST /api/auth/register — create Supabase auth user + insert to profiles
   ☐ POST /api/auth/login — sign in, return JWT token
   ☐ POST /api/auth/logout
   ☐ GET /api/auth/me — return current user data (protected)
☐ POST /api/upload — multer + Supabase Storage upload, return public URL
```

**Person B**
```
☐ public/login.html — login form, email + password, submit calls /api/auth/login
☐ public/register.html — choose role (traveler or legend/volunteer)
☐ public/register-legend.html — 5-step wizard:
   ☐ Step 1: Personal info (name, village, age, specialty)
   ☐ Step 2: Story + AI Debrief option
   ☐ Step 3: Photo upload with preview
   ☐ Step 4: Map click to pin location
   ☐ Step 5: Set weekly availability
☐ public/js/auth.js:
   ☐ login(email, password) — stores token in localStorage
   ☐ logout() — clears localStorage
   ☐ isLoggedIn() — checks for token
   ☐ Update nav links based on auth state
```

**Person C**
```
☐ Debrief UI in register-legend.html step 2:
   ☐ Chat interface (messages appear one by one)
   ☐ Text input + submit button
   ☐ Calls /api/ai/debrief on each answer
   ☐ Shows AI next question
   ☐ Final "Generate Document" button → calls /api/ai/debrief/finalize
```

**End of hour 10:** Can register, login, logout — legend registration wizard works

---

### HOUR 11–12 | Booking System

**Person A**
```
☐ server/routes/bookings.js:
   ☐ POST /api/bookings — create booking:
      ☐ Check session status = 'open'
      ☐ Lock session (UPDATE status='locked', locked_until=NOW()+15min)
      ☐ Create booking record
      ☐ Generate QR token (crypto.randomUUID())
      ☐ Return booking ID + QR token
   ☐ GET /api/bookings/:id — get booking details
   ☐ POST /api/bookings/:id/cancel — cancel, refund logic
   ☐ POST /api/bookings/:id/checkin — legend scans QR to confirm arrival
☐ Cron job every 60 seconds — release expired locks
```

**Person B**
```
☐ Booking flow in legend.html (triggered by "Book" button):
   ☐ Step 1: Date and time selection
   ☐ Step 2: Number of participants + price breakdown update
   ☐ Step 3: Review and confirm
   ☐ Step 4: Show QR code (qrcode.js library)
   ☐ 15-minute countdown timer during booking steps
☐ QR code display + "Add to wallet" download button
```

**Person C**
```
☐ Finalize /api/ai/briefing endpoint
☐ Set up nodemailer with Gmail or Resend
☐ Test full flow: book → confirm → receive briefing email 
☐ Wire cron job to call briefing for tomorrow's bookings
```

**End of hour 12:** Can book a session, see QR code, receive confirmation email

---

### HOUR 13–14 | Dashboards

**Person A**
```
☐ GET /api/travelers/:id/bookings — upcoming + past
☐ GET /api/travelers/:id/wishlist
☐ POST /api/travelers/:id/wishlist/:legend_id — add to wishlist
☐ DELETE /api/travelers/:id/wishlist/:legend_id — remove from wishlist
☐ GET /api/legends/:id/dashboard — bookings, earnings, stats (protected)
```

**Person B**
```
☐ public/dashboard-traveler.html:
   ☐ Upcoming bookings cards with QR access button
   ☐ Past experiences list
   ☐ Wishlist section
   ☐ Experience Passport section (Canvas stamp collection)
☐ public/js/passport.js:
   ☐ Draw passport page on Canvas
   ☐ One stamp per completed booking (village name, date, icon)
   ☐ "Download" button — Canvas to PNG
☐ public/dashboard-legend.html:
   ☐ Upcoming bookings table (confirm/decline buttons)
   ☐ Earnings bar chart (Chart.js)
   ☐ Knowledge document editor (Quill.js)
   ☐ Availability toggle calendar
```

**Person C**
```
☐ Matchmaking UI page (public/match.html):
   ☐ 5-question profile form (interests, style, looking for, etc.)
   ☐ Pulsing loading animation while AI thinks (~3-5 seconds)
   ☐ Animated card reveal when result arrives
   ☐ Large reason text + "View Profile" and "Book Now" buttons
```

**End of hour 14:** Both dashboards functional, matchmaking UI complete

---

### HOUR 15–16 | Admin + Polish Pass 1

**Person A**
```
☐ server/routes/admin.js:
   ☐ GET /api/admin/pending — unverified legends awaiting approval
   ☐ PATCH /api/admin/legends/:id/approve — set is_verified = true
   ☐ PATCH /api/admin/legends/:id/reject — with reason
   ☐ GET /api/admin/stats — platform-wide analytics
☐ Legend dashboard booking actions:
   ☐ PATCH /api/bookings/:id/confirm — legend confirms
   ☐ PATCH /api/bookings/:id/decline — legend declines
```

**Person B**
```
☐ public/admin.html:
   ☐ Pending legends queue with approve/reject buttons
   ☐ Platform stats overview (total users, bookings, revenue)
☐ First pass CSS polish on all pages:
   ☐ Fix any broken layouts
   ☐ Consistent spacing and colors everywhere
   ☐ Loading spinners on all async buttons
   ☐ Error messages that make sense to user
```

**Person C**
```
☐ Finalize Echo feature:
   ☐ POST /api/ai/echo — takes question + legend_id
   ☐ Fetches all transcripts for that legend
   ☐ Returns answer in legend's style
☐ Echo UI on legend profile (only shows if legend is marked as passed)
☐ Fix any AI error handling (malformed responses, timeouts)
```

**End of hour 16:** Admin can approve legends, all AI features work end-to-end

---

### HOUR 17–18 | Mobile Responsive + Real Data

**Person A + C**
```
☐ Add all 8-10 realistic test legends with proper descriptions
☐ Add 3 traveler test accounts with different interest profiles
☐ Create 8 sessions across the top legends
☐ Create 4 completed bookings with reviews
☐ Manually run AI sentiment on each review
☐ Find 5-6 public domain photos of Bulgarian craftspeople (Unsplash)
☐ Upload to Supabase Storage, update photo_url in database
```

**Person B**
```
☐ CSS media queries for all pages:
   ☐ Navigation collapses to hamburger on mobile
   ☐ Map full screen on mobile
   ☐ Cards stack vertically on mobile
   ☐ Legend profile readable on small screen
   ☐ Booking flow works on mobile
☐ Test every page at 375px width (iPhone SE size) in DevTools
```

**End of hour 18:** Site looks great on mobile, demo data ready

---

### HOUR 19–20 | The Wow Moments

**All focus on the things judges will remember**

```
☐ Extinction countdown: make it truly alarming when red
   ☐ Pulse animation on the number
   ☐ Background color shifts to red/orange
   ☐ Small text: "Only X sessions left at current rate"
☐ AI Matchmaking reveal:
   ☐ Confetti or particle effect on reveal
   ☐ Legend card animates in from below
   ☐ Reason text types out letter by letter (typewriter effect)
☐ Map clustering animation:
   ☐ Smooth expand/collapse on zoom
   ☐ Cluster color = average extinction risk of group
☐ Experience Passport:
   ☐ Looks like a real passport with stamps
   ☐ Different stamp design per legend specialty
☐ Homepage hero:
   ☐ Numbers animate counting up when page loads
   ☐ "X legends. X years of knowledge. Running out of time."
```

**End of hour 20:** Demo moments are memorable and polished

---

### HOUR 21–22 | Full Testing

**Systematic test of every critical path**

```
☐ Register as traveler → fill matchmaking → see result → view profile
☐ View profile → click date → complete booking → see QR code
☐ Register as legend (or use existing) → complete Debrief → submit
☐ Login as admin → approve the legend → check it appears on map
☐ Login as legend → confirm an incoming booking
☐ Simulate QR check-in → booking status updates to completed
☐ Submit review → wait 5 seconds → check ai_sentiment saved in Supabase
☐ Add legend to wishlist → check it appears in dashboard
☐ Test on actual mobile phone (not just DevTools)
☐ Test what happens when NOT logged in (should redirect to login)
☐ Test with bad data (empty forms, invalid IDs) — no crashes
☐ Check browser console for errors on every page
☐ Check Network tab — no failing API calls
```

**End of hour 22:** Zero crashes on main user flows

---

### HOUR 23–24 | Presentation Prep

```
☐ Decide exactly which screens to show during demo (max 5 screens)
☐ Write the 3-minute pitch script (Section 12 below)
☐ Rehearse pitch out loud — time it
☐ Prepare answers to:
   "Isn't this Airbnb Experiences?" → YES, ready answer
   "How do you find legends?" → YES, ready answer
   "What's the business model?" → YES, ready answer
   "What happens when a legend dies?" → YES — Echo feature
☐ Take screenshots of every key screen as backup
☐ Record a 2-minute demo video as backup (if live demo fails)
☐ Make sure site is accessible on the network the hackathon uses
```

---

### HOUR 25–26 | Final Bug Fixes

```
☐ Fix ONLY critical bugs (things that crash or break the demo flow)
☐ Do NOT add new features at this point
☐ Double-check: homepage loads → map shows → profile page → booking works
☐ Make sure all 10 test legends show on map
☐ Make sure AI match returns a result within 5 seconds
☐ Verify emails send (or have screenshot evidence they work)
```

---

### HOUR 27–28 | Rest

```
☐ One person monitors, others sleep
☐ Eat actual food
☐ Drink water
☐ Review pitch one more time
☐ You are ready
```

---

## 10. File Structure

```
pingme/
│
├── .env                           ← All secrets (NEVER commit to GitHub)
├── .gitignore                     ← Ignores .env and node_modules
├── package.json                   ← Node.js dependencies and scripts
├── server.js                      ← Entry point, starts Express server
│
├── server/                        ← All backend Node.js code
│   │
│   ├── config/
│   │   ├── supabase.js            ← Creates Supabase client (import this everywhere)
│   │   └── anthropic.js           ← askClaude() function used by all AI routes
│   │
│   ├── middleware/
│   │   └── auth.js                ← Checks JWT token on every protected route
│   │
│   └── routes/
│       ├── legends.js             ← GET/POST/PATCH legend endpoints
│       ├── sessions.js            ← Session management, slot locking
│       ├── bookings.js            ← Create booking, cancel, QR verify
│       ├── reviews.js             ← Submit review, trigger AI sentiment
│       ├── auth.js                ← Register, login, logout, get current user
│       ├── upload.js              ← Handle photo uploads to Supabase Storage
│       ├── admin.js               ← Approve legends, platform stats
│       └── ai.js                  ← All Anthropic API calls (match, debrief, briefing, echo)
│
└── public/                        ← All frontend files (served as static)
    │
    ├── index.html                 ← Homepage
    ├── map.html                   ← Full-screen discovery map
    ├── legend.html                ← Individual legend profile + booking
    ├── match.html                 ← AI matchmaking quiz and result
    ├── login.html                 ← Login form
    ├── register.html              ← Choose role page
    ├── register-legend.html       ← 5-step legend registration wizard
    ├── dashboard-traveler.html    ← Traveler personal space
    ├── dashboard-legend.html      ← Legend management panel
    └── admin.html                 ← Admin moderation
    │
    ├── css/
    │   ├── style.css              ← Global styles, CSS variables, typography, layout
    │   ├── components.css         ← Reusable: buttons, cards, inputs, badges, modals
    │   ├── map.css                ← Map container and Leaflet overrides
    │   └── dashboard.css          ← Dashboard-specific layout styles
    │
    └── js/
        ├── api.js                 ← apiGet() and apiPost() wrappers with auth headers
        ├── auth.js                ← login(), logout(), isLoggedIn(), updateNav()
        ├── map.js                 ← Leaflet init, marker placement, popups, clustering
        ├── calendar.js            ← Custom availability calendar component
        ├── booking.js             ← Multi-step booking flow, slot locking timer, QR
        ├── match.js               ← Matchmaking form, loading animation, result reveal
        ├── debrief.js             ← AI interview chat interface for legend registration
        ├── passport.js            ← Canvas Experience Passport stamp generator
        └── countdown.js           ← Extinction countdown timer, animation, color change
```

---

## 11. All Pages and Features

### index.html — Homepage

**Purpose:** First impression. Must communicate the idea in 10 seconds.

**Sections:**
1. **Navigation** — Logo, "Explore Map", "Find My Match", Login/Signup
2. **Hero** — Large headline: "Meet the last people who know this." Subheadline. Two buttons: "Explore the Map" and "Find My Match"
3. **Live counters** — "X Legends Active | X Sessions Completed | X Knowledge Documents"
4. **How it works** — 3 steps: Find → Book → Meet. Simple icons, one sentence each
5. **Map preview** — Small Leaflet map showing a few legend markers
6. **Extinction alert** — "X legends are in critical risk. Their knowledge cannot wait."
7. **Featured legends** — 3 cards: photo, name, specialty, extinction countdown
8. **Footer** — Links, about, contact

---

### map.html — Discovery Map

**Purpose:** Let travelers explore and find legends.

**Features:**
- Full-screen Leaflet.js map of Bulgaria
- Custom colored markers (green/yellow/red by extinction_risk)
- Cluster view on zoom-out (color = average risk of group)
- Left sidebar: search bar + filters (region, specialty, price range, availability)
- Marker click: popup with photo, name, village, "View Profile" button
- "Surprise Me" button: calls AI serendipity endpoint, jumps to a recommended legend

---

### legend.html?id=X — Legend Profile

**Purpose:** Convert a browser into a booker.

**Sections:**
1. **Hero** — Full-width photo, name, village, age, specialty badge
2. **Extinction Countdown** — Large animated number: "~14 sessions remaining at current rate"
3. **Story** — Long-form description of who they are
4. **Knowledge Document** — AI-generated rich text, audio player if available
5. **Availability Calendar** — Custom calendar, green dates available, grey booked
6. **Price and booking** — Price breakdown, "Book This Session" button
7. **Reviews** — Text reviews + radar chart (Chart.js, 5 dimensions from AI sentiment)
8. **Similar legends** — 3 other legends to explore
9. **Echo** (only if legend is passed) — Chat interface to ask questions

---

### match.html — AI Matchmaking

**Purpose:** Turn the traveler's interests into one perfect legend recommendation.

**Flow:**
1. **5 questions** — interests, travel style, what they're looking for, past experiences, time available
2. **Loading state** — Pulsing animation, "Claude is reading 47 legend profiles..."
3. **Reveal** — Card animates in, legend photo, name, and typewriter-effect reason text
4. **Actions** — "View Full Profile" and "Book Now" buttons

---

### register-legend.html — Legend Registration Wizard

**5 Steps:**
1. Basic info: name, village, age, one-line specialty
2. Story + AI Debrief option (AI interviews them in Bulgarian, auto-fills story)
3. Photo upload with drag-and-drop preview
4. Map click to pin exact location
5. Weekly availability builder (which days, what times)

---

### dashboard-traveler.html — Traveler Dashboard

**Sections:**
- Upcoming bookings (date, legend photo, QR access button, countdown to session)
- Experience Passport (Canvas-generated visual with stamps for each completed session)
- Wishlist (saved legends with notification badges)
- Past experiences (with Memory Package PDF download link)
- Profile settings and matchmaking preferences

---

### dashboard-legend.html — Legend Dashboard

**Sections:**
- Upcoming bookings table (traveler name, date, participants, confirm/decline buttons)
- Earnings chart — bar chart by month (Chart.js)
- Knowledge Document editor (Quill.js rich text)
- Availability manager — toggle days on/off
- Guest management — past travelers, ratings received

---

## 12. Pitch Script

**Total time: 3 minutes**

---

**[0:00–0:20] The hook**

"Bai Stoyan knows every hidden cave in the Rhodope mountains. He has spent 54 years learning their names, their histories, their secrets. He is 74 years old. When he dies — and statistically, that is within the next 10 years — everything he knows dies with him. Not archived. Not digitized. Simply gone."

---

**[0:20–0:40] The scale**

"In Bulgaria there are thousands of people like Bai Stoyan. They carry irreplaceable knowledge — ancient crafts, forgotten recipes, oral histories that exist nowhere else on Earth. And right now, a generation of travelers is actively looking for exactly this: something real. Something that cannot be Googled. They never meet. There is no platform. Until PingMe."

---

**[0:40–1:20] The product — live demo**

"PingMe has three things other platforms don't. First: the Extinction Countdown. Every legend's profile shows exactly how many sessions remain at current booking rate. When someone books Bai Stoyan, the number goes up. The urgency is real.

Second: AI Matchmaking. You tell Claude what you care about. Claude reads every legend profile and recommends one — with a personal explanation of why exactly you two should meet.

Third: the Debrief. Before a legend registers, our AI interviews them in simple Bulgarian — asking the follow-up questions that extract the knowledge in their hands, not just their words. The result is a documented archive that outlives them."

---

**[1:20–1:40] Pre-empt the Airbnb question**

"You will ask: isn't this Airbnb Experiences? Airbnb requires English proficiency, a Stripe account, professional photos, and a consistent schedule. Bai Stoyan has none of those. PingMe takes on every administrative burden. He only needs to know something irreplaceable."

---

**[1:40–2:00] Business model**

"The model is simple: travelers pay a session fee. 80 percent goes directly to the legend — more than any gig platform. 20 percent goes to PingMe. At our conservative estimate of 100 active legends in Bulgaria, that is 2,400 euros per month. The knowledge archive we build compounds in value every year."

---

**[2:00–2:30] The emotional close**

"Every technology project in this room solves a problem. PingMe solves a loss. Not a problem that can be fixed later. A loss that is happening right now. When Bai Stoyan dies, his knowledge is gone forever — unless someone meets him first.

PingMe is the platform that makes that meeting happen."

---

**[2:30–3:00] Answer the "what if a legend dies" question (preemptively)**

"And for the knowledge we have already collected — for the legends who are no longer with us — we built Echo. Using transcripts from their sessions, our AI allows visitors to still ask questions. To still hear, in their words, what they knew. The platform does not end when the legend does."

---

*End.*

---

*PingMe — built in 28 hours for Hack TUES 12*
*Code to Care | Beyond the City | Travel with Purpose*
