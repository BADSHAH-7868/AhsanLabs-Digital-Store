import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));

const productsPath = path.join(__dirname, "public/products.json");

// Default products (auto-create if missing)
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
  },
];

if (!fs.existsSync(productsPath)) {
  fs.writeFileSync(productsPath, JSON.stringify(defaultProducts, null, 2));
  console.log("✅ Created default products.json");
}

// 🧩 Helper: Push changes to GitHub automatically (optional)
function pushChangesToGitHub(commitMessage = "Auto update from server") {
  exec(
    `git add -A && git commit -m "${commitMessage}" && git push`,
    { env: { ...process.env, GIT_ASKPASS: "echo" } },
    (err, stdout, stderr) => {
      if (err) {
        console.error("Git push error:", stderr || err);
        return;
      }
      console.log("✅ Git push successful:\n", stdout);
    }
  );
}

// 🖼 Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public/images");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const customName = req.body.customName?.trim();
    const filename = customName
      ? `${customName}${ext}`
      : `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|gif|webp/;
    const isValid =
      types.test(file.mimetype) &&
      types.test(path.extname(file.originalname).toLowerCase());
    if (isValid) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// 📦 GET products
app.get("/api/products", (req, res) => {
  try {
    const data = fs.readFileSync(productsPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading products:", err);
    res.status(500).json({ error: "Failed to read products" });
  }
});

// 💾 POST update products
app.post("/api/products", (req, res) => {
  try {
    const updatedProducts = req.body;
    fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
    console.log("✅ Products updated successfully");
    // pushChangesToGitHub("Auto update products"); // optional
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating products:", err);
    res.status(500).json({ error: "Failed to update products" });
  }
});

// 🖼 Upload single image
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No image uploaded" });

    const imageUrl = `/images/${req.file.filename}`;
    console.log("📸 Uploaded:", imageUrl);
    res.json({ imageUrl });
  } catch (err) {
    console.error("Image upload failed:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// 🌍 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
