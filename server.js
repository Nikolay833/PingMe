require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRouter         = require('./server/routes/auth');
const profileRouter      = require('./server/routes/profile');
const uploadRouter       = require('./server/routes/upload');
const matchRouter        = require('./server/routes/match');
const notificationsRouter = require('./server/routes/notifications');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Homepage', 'index.html')));

app.use('/api/auth',          authRouter);
app.use('/api/profile',       profileRouter);
app.use('/api/upload',        uploadRouter);
app.use('/api/match',         matchRouter);
app.use('/api/notifications', notificationsRouter);

app.listen(PORT, () => {
  console.log(`PingMe server running on http://localhost:${PORT}`);
});
