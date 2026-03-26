require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const legendsRouter  = require('./server/routes/legends');
const sessionsRouter = require('./server/routes/sessions');
const bookingsRouter = require('./server/routes/bookings');
const reviewsRouter  = require('./server/routes/reviews');
const authRouter     = require('./server/routes/auth');
const uploadRouter   = require('./server/routes/upload');
const adminRouter    = require('./server/routes/admin');
const aiRouter       = require('./server/routes/ai');

const supabase = require('./server/config/supabase');
const { sendPreVisitBriefing } = require('./server/routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/legends',  legendsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews',  reviewsRouter);
app.use('/api/auth',     authRouter);
app.use('/api/signup',   authRouter);   // legacy route from login.html
app.use('/api/upload',   uploadRouter);
app.use('/api/admin',    adminRouter);
app.use('/api/ai',       aiRouter);

// Platform stats
app.get('/api/stats', async (req, res) => {
  const [
    { count: total_legends },
    { count: total_sessions },
    { count: knowledge_docs_count }
  ] = await Promise.all([
    supabase.from('legends').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('knowledge_docs').select('*', { count: 'exact', head: true }).eq('is_public', true),
  ]);
  res.json({ total_legends, total_sessions, knowledge_docs_count });
});

// Cron: release expired booking locks every 60 seconds
cron.schedule('* * * * *', async () => {
  await supabase
    .from('sessions')
    .update({ status: 'open', locked_until: null })
    .eq('status', 'locked')
    .lt('locked_until', new Date().toISOString());
});

// Cron: send pre-visit briefing emails every hour
cron.schedule('0 * * * *', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('id, sessions(date)')
    .eq('status', 'confirmed')
    .eq('sessions.date', tomorrowDate);

  if (upcomingBookings) {
    for (const booking of upcomingBookings) {
      await sendPreVisitBriefing(booking.id);
    }
  }
});

app.listen(PORT, () => {
  console.log(`PingMe server running on http://localhost:${PORT}`);
});
