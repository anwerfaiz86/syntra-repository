const express = require('express');
const router = express.Router();
const Defect = require('../models/Defect');
const multer = require('multer');
const path = require('path');

const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_PATH),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST /defects
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, reporter } = req.body;
    const imageUrl = req.file ? `/${UPLOAD_PATH}/${req.file.filename}` : null;
    const d = new Defect({ title, description, category, reporter, imageUrl });
    await d.save();
    res.status(201).json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /defects  (supports ?role=employee&id=emp-1 and ?sortBy=newest|status)
router.get('/', async (req, res) => {
  try {
    const { role, id, sortBy } = req.query;
    const filter = (role === 'employee' && id) ? { reporter: id } : {};
    let q = Defect.find(filter);
    if (sortBy === 'newest') q = q.sort({ createdAt: -1 });
    if (sortBy === 'status') q = q.sort({ status: 1, createdAt: -1 });
    const list = await q.exec();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /defects/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes)  update.notes = notes;
    update.updatedAt = new Date();
    const updated = await Defect.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /defects/counts/summary
router.get('/counts/summary', async (req, res) => {
  try {
    const agg = await Defect.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const counts = agg.reduce((a,c)=> (a[c._1]=c.count,a), {}); // safe fallback handled below
    res.json({
      Open: (counts && counts['Open']) || 0,
      'Under Review': (counts && counts['Under Review']) || 0,
      Resolved: (counts && counts['Resolved']) || 0,
      Rejected: (counts && counts['Rejected']) || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
