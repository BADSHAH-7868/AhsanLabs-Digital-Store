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

// Initialize products.json with default data if it doesn't exist
const defaultProducts = [
  {
    id: "1",
    name: "Premium Digital Course",
    description: "Master the fundamentals with our comprehensive digital course. Includes lifetime access, 50+ hours of content, and certificate.",
    price: 149.99,
    originalPrice: 1000,
    image: "/images/capcut.png",
    category: "Education",
    rating: 4.8,
    reviews: 234,
    features: [
      "50+ hours of video content",
      "Lifetime access",
      "Certificate of completion",
      "24/7 support",
      "Downloadable resources"
    ],
    offerEndsAt: "2025-11-01T20:00",
    inStock: true,
    whatsappNumber: "1234567890",
    whatsappMessage: "Hi! I'm interested in the Premium Digital Course",
    productlink: "example.com",
    is_scratch: true,
    scratch_disc: 20,
    scratch_coupon: "scratche2",
    specialcode: "",
    specialdisc: 0
  },
  {
    id: "2",
    name: "Pro Design Templates Pack",
    description: "100+ professional templates for your business. Includes Figma, PSD, and Sketch files with commercial license.",
    price: 49.99,
    originalPrice: 149.99,
    image: "/images/ap.png",
    category: "Design",
    rating: 4.9,
    reviews: 567,
    features: [
      "100+ premium templates",
      "Figma, PSD & Sketch files",
      "Commercial license",
      "Regular updates",
      "Free lifetime updates"
    ],
    offerEndsAt: "2025-10-30T00:00:00Z",
    inStock: true,
    whatsappNumber: "1234567890",
    whatsappMessage: "Hi! I'm interested in the Pro Design Templates Pack",
    productlink: "",
    is_scratch: false,
    scratch_disc: 0,
    scratch_coupon: "",
    specialcode: "",
    specialdisc: 0
  },
  {
    id: "3",
    name: "Capcut Pro Working Apk",
    description: "Everything you need to skyrocket your marketing. Includes email templates, social media graphics, and automation scripts.",
    price: 149.99,
    originalPrice: 249.99,
    image: "/images/capcut.png",
    category: "Editing",
    rating: 4.7,
    reviews: 189,
    features: [
      "Email marketing templates",
      "Social media graphics pack",
      "Automation scripts",
      "SEO optimization guide",
      "Analytics dashboard"
    ],
    offerEndsAt: "2025-11-05T12:00",
    inStock: true,
    whatsappNumber: "923343926359",
    whatsappMessage: "Hi! I'm interested in the Capcut Pro Apk",
    productlink: "https://drive.google.com/drive/folders/1TEXaat6zR94eKrA9xQUghUDWai9jhqi7",
    specialcode: "CAPLABS",
    specialdisc: 100,
    is_scratch: true,
    scratch_disc: 100,
    scratch_coupon: "scratche"
  }
];

if (!fs.existsSync(productsPath)) {
  fs.writeFileSync(productsPath, JSON.stringify(defaultProducts, null, 2));
}

// GitHub push function
function pushChangesToGitHub(commitMessage = 'Update products and images') {
  exec(`
    git add public/products.json public/images
    git commit -m "${commitMessage}"
    git push origin main
  `, (err, stdout, stderr) => {
    if (err) {
      console.error('Git push error:', err);
      return;
    }
    console.log('Git push successful:', stdout);
  });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const customName = req.body.customName;
    if (customName) {
      const ext = path.extname(file.originalname);
      const sanitizedName = customName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, '');
      cb(null, sanitizedName + ext);
    } else {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
  }
});

// GET products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(productsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// POST updated products
app.post('/api/products', (req, res) => {
  try {
    const updatedProducts = req.body;
    fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

    // Push to GitHub automatically
    pushChangesToGitHub('Update products from admin panel');

    res.json({ message: 'Products updated and pushed to GitHub!' });
  } catch (error) {
    console.error('Error saving products:', error);
    res.status(500).json({ error: 'Failed to save products' });
  }
});

// POST upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid file type' });

  const imageUrl = `/images/${req.file.filename}`;

  // Push uploaded image to GitHub automatically
  pushChangesToGitHub(`Upload image ${req.file.filename}`);

  res.json({ imageUrl });
});

app.listen(5000, () => console.log('Server running on port 5000'));
