import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const productsPath = path.join(__dirname, 'public/products.json');

// Default products (agar file nahi hai)
const defaultProducts = [
  {
    id: "1",
    name: "Premium Digital Course",
    description: "Master the fundamentals with our comprehensive digital course.",
    price: 149.99,
    originalPrice: 1000,
    image: "/images/capcut.png",
    category: "Education",
    rating: 4.8,
    reviews: 234,
    inStock: true,
  },
  {
    id: "2",
    name: "Pro Design Templates Pack",
    description: "100+ professional templates for your business.",
    price: 49.99,
    originalPrice: 149.99,
    image: "/images/ap.png",
    category: "Design",
    rating: 4.9,
    reviews: 567,
    inStock: true,
  }
];

if (!fs.existsSync(productsPath)) {
  fs.writeFileSync(productsPath, JSON.stringify(defaultProducts, null, 2));
}

// GitHub push function
function pushChangesToGitHub(commitMessage = 'Auto update from server') {
  exec(
    `git add -A && git commit -m "${commitMessage}" && git push`,
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

// Multer config for image uploads (random numeric filenames)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = Date.now() + '-' + Math.floor(Math.random() * 1e9) + ext;
    cb(null, randomName);
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

// API: GET products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(productsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading products:', err);
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// API: POST update products
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

// API: POST upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  console.log('🖼 Image uploaded:', req.file.filename);
  pushChangesToGitHub(`Upload image ${req.file.filename}`);
  res.json({ imageUrl: `/images/${req.file.filename}` });
});

// File watcher for images folder (auto Git push on add/change/unlink/rename)
const watcher = chokidar.watch(path.join(__dirname, 'public/images'), { persistent: true });
watcher.on('all', (event, filePath) => {
  console.log(`🔄 Event: ${event} on ${filePath}`);
  pushChangesToGitHub(`Auto update: ${path.basename(filePath)}`);
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
