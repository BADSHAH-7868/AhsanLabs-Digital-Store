import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const productsPath = path.join(__dirname, 'public', 'products.json');

const defaultProducts = [
  // ... yahan tumhara default products JSON array ...
];

if (!fs.existsSync(productsPath)) {
  fs.writeFileSync(productsPath, JSON.stringify(defaultProducts, null, 2));
}

// GitHub push function
function pushChangesToGitHub(commitMessage = 'Update products and images') {
  exec(
    `git add . && git commit -m "${commitMessage}" && git push`,
    { env: { ...process.env, GIT_ASKPASS: 'echo' } },
    (err, stdout, stderr) => {
      if (err) {
        console.error('Git push error:', stderr || err);
        return;
      }
      console.log('✅ Git push successful:\n', stdout);
    }
  );
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const customName = req.body.customName;
    if (customName) {
      const ext = path.extname(file.originalname);
      const sanitized = customName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '');
      cb(null, sanitized + ext);
    } else {
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    }
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|gif/;
    if (types.test(file.mimetype) && types.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only images allowed (jpeg, jpg, png, gif)'));
  }
});

// GET products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(productsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading products:', err);
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// POST updated products
app.post('/api/products', (req, res) => {
  try {
    const updated = req.body;
    fs.writeFileSync(productsPath, JSON.stringify(updated, null, 2));
    console.log('📦 Products updated locally');
    pushChangesToGitHub('Update products from admin panel');
    res.json({ message: 'Products updated and pushed to GitHub!' });
  } catch (err) {
    console.error('Error saving products:', err);
    res.status(500).json({ error: 'Failed to save products' });
  }
});

// POST upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  console.log('🖼 Image uploaded:', req.file.filename);
  pushChangesToGitHub(`Upload image ${req.file.filename}`);
  res.json({ imageUrl: `/images/${req.file.filename}` });
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
