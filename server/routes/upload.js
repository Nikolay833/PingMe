const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// POST /api/upload
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('legend-photos')
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype });

  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data: { publicUrl } } = supabase.storage
    .from('legend-photos')
    .getPublicUrl(filename);

  res.json({ success: true, url: publicUrl });
});

module.exports = router;
